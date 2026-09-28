package com.connectx.message.dto;

import java.util.UUID;

public class WsMessagePayload {

    private String type; // CHAT_MESSAGE, MESSAGE_SENT, NEW_MESSAGE, TYPING, USER_TYPING, MARK_READ, MESSAGES_READ, USER_STATUS, ERROR
    private UUID recipientId;
    private UUID senderId;
    private String content;
    private String messageType;
    private String mediaUrl;
    private String mediaName;
    private Boolean isTyping;
    private String status;
    private MessageDto message;
    private String error;
    private java.util.Set<UUID> onlineUserIds;

    private java.time.Instant timestamp;

    public WsMessagePayload() {
    }

    public static WsMessagePayload onlineUsersList(java.util.Set<UUID> userIds) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("ONLINE_USERS_LIST");
        p.setOnlineUserIds(userIds);
        return p;
    }

    public static WsMessagePayload messageSent(MessageDto message) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("MESSAGE_SENT");
        p.setMessage(message);
        return p;
    }

    public static WsMessagePayload newMessage(MessageDto message) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("NEW_MESSAGE");
        p.setMessage(message);
        return p;
    }

    public static WsMessagePayload userTyping(UUID senderId, boolean isTyping) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("USER_TYPING");
        p.setSenderId(senderId);
        p.setIsTyping(isTyping);
        return p;
    }

    public static WsMessagePayload messagesRead(UUID readerId) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("MESSAGES_READ");
        p.setSenderId(readerId);
        return p;
    }

    public static WsMessagePayload userStatus(UUID userId, String status) {
        return userStatus(userId, status, java.time.Instant.now());
    }

    public static WsMessagePayload userStatus(UUID userId, String status, java.time.Instant timestamp) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("USER_STATUS");
        p.setSenderId(userId);
        p.setStatus(status);
        p.setTimestamp(timestamp != null ? timestamp : java.time.Instant.now());
        return p;
    }

    public static WsMessagePayload error(String message) {
        WsMessagePayload p = new WsMessagePayload();
        p.setType("ERROR");
        p.setError(message);
        return p;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public UUID getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(UUID recipientId) {
        this.recipientId = recipientId;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMessageType() {
        return messageType;
    }

    public void setMessageType(String messageType) {
        this.messageType = messageType;
    }

    public String getMediaUrl() {
        return mediaUrl;
    }

    public void setMediaUrl(String mediaUrl) {
        this.mediaUrl = mediaUrl;
    }

    public String getMediaName() {
        return mediaName;
    }

    public void setMediaName(String mediaName) {
        this.mediaName = mediaName;
    }

    public Boolean getIsTyping() {
        return isTyping;
    }

    public void setIsTyping(Boolean isTyping) {
        this.isTyping = isTyping;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public MessageDto getMessage() {
        return message;
    }

    public void setMessage(MessageDto message) {
        this.message = message;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public java.util.Set<UUID> getOnlineUserIds() {
        return onlineUserIds;
    }

    public void setOnlineUserIds(java.util.Set<UUID> onlineUserIds) {
        this.onlineUserIds = onlineUserIds;
    }

    public java.time.Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(java.time.Instant timestamp) {
        this.timestamp = timestamp;
    }
}
