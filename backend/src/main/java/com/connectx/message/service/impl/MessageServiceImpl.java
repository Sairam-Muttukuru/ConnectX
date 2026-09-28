package com.connectx.message.service.impl;

import com.connectx.common.exception.ResourceNotFoundException;
import com.connectx.dashboard.dto.UserSearchResultDto;
import com.connectx.dashboard.entity.Friendship;
import com.connectx.dashboard.repository.FriendshipRepository;
import com.connectx.message.dto.ConversationDto;
import com.connectx.message.dto.MessageDto;
import com.connectx.message.dto.SendMessageRequest;
import com.connectx.message.entity.Message;
import com.connectx.message.entity.MessageStatus;
import com.connectx.message.entity.MessageType;
import com.connectx.message.repository.MessageRepository;
import com.connectx.message.service.MessageService;
import com.connectx.message.websocket.ChatWebSocketHandler;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageServiceImpl implements MessageService {

    private final MessageRepository messageRepository;
    private final UserRepository userRepository;
    private final FriendshipRepository friendshipRepository;
    private final ChatWebSocketHandler chatWebSocketHandler;

    public MessageServiceImpl(
            MessageRepository messageRepository,
            UserRepository userRepository,
            FriendshipRepository friendshipRepository,
            @Lazy ChatWebSocketHandler chatWebSocketHandler) {
        this.messageRepository = messageRepository;
        this.userRepository = userRepository;
        this.friendshipRepository = friendshipRepository;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @Override
    @Transactional
    public MessageDto sendMessage(UUID senderId, SendMessageRequest request) {
        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new ResourceNotFoundException("Sender not found with ID: " + senderId));
        User recipient = userRepository.findById(request.getRecipientId())
                .orElseThrow(() -> new ResourceNotFoundException("Recipient not found with ID: " + request.getRecipientId()));

        MessageType msgType = MessageType.TEXT;
        if (request.getMessageType() != null) {
            try {
                msgType = MessageType.valueOf(request.getMessageType().toUpperCase());
            } catch (IllegalArgumentException ignored) {
            }
        }

        Message message = new Message();
        message.setSender(sender);
        message.setRecipient(recipient);
        message.setContent(request.getContent() != null ? request.getContent() : "");
        message.setMessageType(msgType);
        message.setMediaUrl(request.getMediaUrl());
        message.setMediaName(request.getMediaName());

        boolean isRecipientOnline = chatWebSocketHandler.isUserOnline(recipient.getId());
        message.setStatus(isRecipientOnline ? MessageStatus.DELIVERED : MessageStatus.SENT);

        Message saved = messageRepository.save(message);
        return MessageDto.fromEntity(saved);
    }

    @Override
    @Transactional
    public List<MessageDto> getConversationHistory(UUID currentUserId, UUID partnerId) {
        // Mark partner's unread messages to current user as READ
        messageRepository.markConversationAsRead(partnerId, currentUserId, MessageStatus.READ, Instant.now());

        List<Message> messages = messageRepository.findConversationHistory(currentUserId, partnerId);
        return messages.stream()
                .map(MessageDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<ConversationDto> getConversations(UUID currentUserId) {
        // 1. Get all messages involving current user ordered by createdAt DESC
        List<Message> allMessages = messageRepository.findAllByUserIdOrderByCreatedAtDesc(currentUserId);

        Map<UUID, Message> latestMessageByPartner = new LinkedHashMap<>();
        Map<UUID, User> partnerMap = new HashMap<>();

        for (Message msg : allMessages) {
            User partner = msg.getSender().getId().equals(currentUserId) ? msg.getRecipient() : msg.getSender();
            UUID pid = partner.getId();
            if (!latestMessageByPartner.containsKey(pid)) {
                latestMessageByPartner.put(pid, msg);
                partnerMap.put(pid, partner);
            }
        }

        // 2. Also fetch all friends of current user
        List<Friendship> friendships = friendshipRepository.findByUserId(currentUserId);
        Set<UUID> friendIds = new HashSet<>();
        for (Friendship f : friendships) {
            User friend = f.getFriend();
            friendIds.add(friend.getId());
            if (!partnerMap.containsKey(friend.getId())) {
                partnerMap.put(friend.getId(), friend);
            }
        }

        List<ConversationDto> conversationList = new ArrayList<>();

        for (Map.Entry<UUID, User> entry : partnerMap.entrySet()) {
            UUID pid = entry.getKey();
            User partner = entry.getValue();
            Message latestMsg = latestMessageByPartner.get(pid);

            String lastMsgText = "";
            Instant lastMsgTime = null;
            UUID lastMsgSenderId = null;
            String lastMsgType = "TEXT";

            if (latestMsg != null) {
                lastMsgText = latestMsg.getContent();
                lastMsgTime = latestMsg.getCreatedAt();
                lastMsgSenderId = latestMsg.getSender().getId();
                lastMsgType = latestMsg.getMessageType() != null ? latestMsg.getMessageType().name() : "TEXT";
            }

            long unread = messageRepository.countBySenderIdAndRecipientIdAndStatusNot(pid, currentUserId, MessageStatus.READ);
            boolean isOnline = chatWebSocketHandler.isUserOnline(pid);
            boolean isFriend = friendIds.contains(pid);

            String displayName = (partner.getDisplayName() != null && !partner.getDisplayName().isBlank())
                    ? partner.getDisplayName()
                    : partner.getUsername();

            ConversationDto dto = new ConversationDto(
                    pid,
                    partner.getUsername(),
                    displayName,
                    partner.getAvatarUrl(),
                    lastMsgText,
                    lastMsgTime,
                    lastMsgSenderId,
                    lastMsgType,
                    unread,
                    isOnline,
                    isFriend
            );
            Instant lastSeen = chatWebSocketHandler.getLastSeen(pid);
            if (lastSeen == null) {
                lastSeen = (latestMsg != null && latestMsg.getCreatedAt() != null)
                        ? latestMsg.getCreatedAt()
                        : partner.getUpdatedAt();
            }
            dto.setLastSeen(lastSeen);
            conversationList.add(dto);
        }

        // Sort: latest message timestamp descending, then alphabetical
        conversationList.sort((a, b) -> {
            if (a.getLastMessageTime() != null && b.getLastMessageTime() != null) {
                return b.getLastMessageTime().compareTo(a.getLastMessageTime());
            } else if (a.getLastMessageTime() != null) {
                return -1;
            } else if (b.getLastMessageTime() != null) {
                return 1;
            } else {
                return a.getDisplayName().compareToIgnoreCase(b.getDisplayName());
            }
        });

        return conversationList;
    }

    @Override
    @Transactional
    public void markConversationAsRead(UUID currentUserId, UUID partnerId) {
        messageRepository.markConversationAsRead(partnerId, currentUserId, MessageStatus.READ, Instant.now());
    }

    @Override
    @Transactional(readOnly = true)
    public long getUnreadMessagesCount(UUID currentUserId) {
        return messageRepository.countByRecipientIdAndStatusNot(currentUserId, MessageStatus.READ);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserSearchResultDto> getFriendsToChat(UUID currentUserId) {
        List<Friendship> friendships = friendshipRepository.findByUserId(currentUserId);
        return friendships.stream().map(f -> {
            User fr = f.getFriend();
            return new UserSearchResultDto(
                    fr.getId(),
                    fr.getUsername(),
                    fr.getDisplayName(),
                    fr.getAvatarUrl(),
                    fr.getBio(),
                    true,
                    false
            );
        }).collect(Collectors.toList());
    }
}
