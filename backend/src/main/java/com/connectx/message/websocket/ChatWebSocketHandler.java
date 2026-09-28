package com.connectx.message.websocket;

import com.connectx.message.dto.MessageDto;
import com.connectx.message.dto.SendMessageRequest;
import com.connectx.message.dto.WsMessagePayload;
import com.connectx.message.service.MessageService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.CopyOnWriteArraySet;

@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final Logger log = LoggerFactory.getLogger(ChatWebSocketHandler.class);

    private final ObjectMapper objectMapper;
    private final MessageService messageService;

    // Map of userId -> active WebSocket sessions
    private final ConcurrentHashMap<UUID, Set<WebSocketSession>> userSessions = new ConcurrentHashMap<>();
    // Map of userId -> last seen instant
    private final ConcurrentHashMap<UUID, java.time.Instant> userLastSeen = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(ObjectMapper objectMapper, @Lazy MessageService messageService) {
        this.objectMapper = objectMapper;
        this.messageService = messageService;
    }

    public boolean isUserOnline(UUID userId) {
        if (userId == null) return false;
        Set<WebSocketSession> sessions = userSessions.get(userId);
        return sessions != null && !sessions.isEmpty();
    }

    public void sendToUser(UUID userId, WsMessagePayload payload) {
        if (userId == null || payload == null) return;
        Set<WebSocketSession> sessions = userSessions.get(userId);
        if (sessions == null || sessions.isEmpty()) return;

        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage textMessage = new TextMessage(json);
            for (WebSocketSession session : sessions) {
                if (session.isOpen()) {
                    synchronized (session) {
                        try {
                            session.sendMessage(textMessage);
                        } catch (IOException e) {
                            log.error("Error sending message to user {}: {}", userId, e.getMessage());
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to serialize WebSocket payload for user {}: {}", userId, e.getMessage());
        }
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        UUID userId = getUserId(session);
        if (userId != null) {
            userSessions.computeIfAbsent(userId, k -> new CopyOnWriteArraySet<>()).add(session);
            userLastSeen.put(userId, java.time.Instant.now());
            log.info("WebSocket connected for user: {} (Total sessions for user: {})",
                    userId, userSessions.get(userId).size());

            // Acknowledge connection to client
            WsMessagePayload ack = new WsMessagePayload();
            ack.setType("CONNECTED");
            ack.setContent("Connected to ConnectX Real-Time Chat");
            sendDirect(session, ack);

            // Send full list of currently online user IDs to this session
            WsMessagePayload onlineUsersList = WsMessagePayload.onlineUsersList(new HashSet<>(userSessions.keySet()));
            sendDirect(session, onlineUsersList);

            // Broadcast ONLINE status to all other active connected users
            WsMessagePayload statusPayload = WsMessagePayload.userStatus(userId, "ONLINE");
            broadcastToOthers(userId, statusPayload);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) {
        UUID senderId = getUserId(session);
        if (senderId == null) {
            log.warn("Unauthenticated WebSocket session sent message, closing session");
            try {
                session.close(CloseStatus.NOT_ACCEPTABLE);
            } catch (IOException ignored) {}
            return;
        }

        try {
            WsMessagePayload payload = objectMapper.readValue(message.getPayload(), WsMessagePayload.class);
            String type = payload.getType() != null ? payload.getType().toUpperCase() : "";

            switch (type) {
                case "SEND_MESSAGE":
                case "CHAT_MESSAGE":
                    handleSendMessage(senderId, session, payload);
                    break;

                case "TYPING":
                    handleTyping(senderId, payload);
                    break;

                case "MARK_READ":
                    handleMarkRead(senderId, payload);
                    break;

                case "PING":
                    WsMessagePayload pong = new WsMessagePayload();
                    pong.setType("PONG");
                    sendDirect(session, pong);
                    break;

                case "GET_ONLINE_USERS":
                    WsMessagePayload onlineList = WsMessagePayload.onlineUsersList(new HashSet<>(userSessions.keySet()));
                    sendDirect(session, onlineList);
                    break;

                default:
                    log.debug("Unknown WebSocket message type: {}", type);
            }
        } catch (Exception e) {
            log.error("Failed to process incoming WebSocket text message from user {}: {}", senderId, e.getMessage());
            sendDirect(session, WsMessagePayload.error("Failed to process message: " + e.getMessage()));
        }
    }

    private void handleSendMessage(UUID senderId, WebSocketSession session, WsMessagePayload payload) {
        if (payload.getRecipientId() == null) {
            sendDirect(session, WsMessagePayload.error("Recipient ID cannot be null"));
            return;
        }

        SendMessageRequest req = new SendMessageRequest();
        req.setRecipientId(payload.getRecipientId());
        req.setContent(payload.getContent());
        req.setMessageType(payload.getMessageType() != null ? payload.getMessageType() : "TEXT");
        req.setMediaUrl(payload.getMediaUrl());
        req.setMediaName(payload.getMediaName());

        MessageDto saved = messageService.sendMessage(senderId, req);

        // 1. Send confirmation back to sender's all open tabs/sessions
        sendToUser(senderId, WsMessagePayload.messageSent(saved));

        // 2. Deliver in real-time to recipient if online (and different from sender)
        if (!payload.getRecipientId().equals(senderId) && isUserOnline(payload.getRecipientId())) {
            sendToUser(payload.getRecipientId(), WsMessagePayload.newMessage(saved));
        }
    }

    private void handleTyping(UUID senderId, WsMessagePayload payload) {
        if (payload.getRecipientId() != null && !payload.getRecipientId().equals(senderId)) {
            boolean isTyping = Boolean.TRUE.equals(payload.getIsTyping());
            WsMessagePayload typingNotice = WsMessagePayload.userTyping(senderId, isTyping);
            sendToUser(payload.getRecipientId(), typingNotice);
        }
    }

    private void handleMarkRead(UUID readerId, WsMessagePayload payload) {
        UUID partnerId = payload.getSenderId() != null ? payload.getSenderId() : payload.getRecipientId();
        if (partnerId != null) {
            messageService.markConversationAsRead(readerId, partnerId);
            // Notify partner that messages have been read
            WsMessagePayload readReceipt = WsMessagePayload.messagesRead(readerId);
            sendToUser(partnerId, readReceipt);
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        UUID userId = getUserId(session);
        if (userId != null) {
            Set<WebSocketSession> sessions = userSessions.get(userId);
            if (sessions != null) {
                sessions.remove(session);
                if (sessions.isEmpty()) {
                    userSessions.remove(userId);
                    java.time.Instant now = java.time.Instant.now();
                    userLastSeen.put(userId, now);
                    // Broadcast OFFLINE status to all remaining users with last seen timestamp
                    WsMessagePayload offlinePayload = WsMessagePayload.userStatus(userId, "OFFLINE", now);
                    broadcastToOthers(userId, offlinePayload);
                }
            }
            log.info("WebSocket disconnected for user: {}", userId);
        }
    }

    public void broadcastToOthers(UUID excludedUserId, WsMessagePayload payload) {
        if (payload == null) return;
        try {
            String json = objectMapper.writeValueAsString(payload);
            TextMessage textMessage = new TextMessage(json);
            for (Map.Entry<UUID, Set<WebSocketSession>> entry : userSessions.entrySet()) {
                if (excludedUserId != null && excludedUserId.equals(entry.getKey())) {
                    continue;
                }
                for (WebSocketSession session : entry.getValue()) {
                    if (session.isOpen()) {
                        synchronized (session) {
                            try {
                                session.sendMessage(textMessage);
                            } catch (IOException e) {
                                log.error("Error broadcasting to user {}: {}", entry.getKey(), e.getMessage());
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to serialize broadcast payload: {}", e.getMessage());
        }
    }

    private UUID getUserId(WebSocketSession session) {
        Object val = session.getAttributes().get("userId");
        if (val instanceof UUID) {
            return (UUID) val;
        } else if (val instanceof String) {
            try {
                return UUID.fromString((String) val);
            } catch (Exception ignored) {}
        }
        return null;
    }

    private void sendDirect(WebSocketSession session, WsMessagePayload payload) {
        if (session != null && session.isOpen()) {
            synchronized (session) {
                try {
                    String json = objectMapper.writeValueAsString(payload);
                    session.sendMessage(new TextMessage(json));
                } catch (IOException e) {
                    log.error("Error sending direct WebSocket message: {}", e.getMessage());
                }
            }
        }
    }

    public java.time.Instant getLastSeen(UUID userId) {
        if (userId == null) return null;
        return userLastSeen.get(userId);
    }
}
