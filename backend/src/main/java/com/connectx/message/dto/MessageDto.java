package com.connectx.message.dto;

import com.connectx.message.entity.Message;
import java.time.Instant;
import java.util.UUID;

public class MessageDto {

    private UUID id;
    private UUID senderId;
    private String senderUsername;
    private String senderDisplayName;
    private String senderAvatarUrl;

    private UUID recipientId;
    private String recipientUsername;
    private String recipientDisplayName;
    private String recipientAvatarUrl;

    private String content;
    private String messageType;
    private String mediaUrl;
    private String mediaName;
    private String status;
    private Instant createdAt;
    private Instant readAt;

    public MessageDto() {
    }

    public static MessageDto fromEntity(Message message) {
        if (message == null) return null;
        MessageDto dto = new MessageDto();
        dto.setId(message.getId());

        if (message.getSender() != null) {
            dto.setSenderId(message.getSender().getId());
            dto.setSenderUsername(message.getSender().getUsername());
            dto.setSenderDisplayName(message.getSender().getDisplayName());
            dto.setSenderAvatarUrl(message.getSender().getAvatarUrl());
        }

        if (message.getRecipient() != null) {
            dto.setRecipientId(message.getRecipient().getId());
            dto.setRecipientUsername(message.getRecipient().getUsername());
            dto.setRecipientDisplayName(message.getRecipient().getDisplayName());
            dto.setRecipientAvatarUrl(message.getRecipient().getAvatarUrl());
        }

        dto.setContent(message.getContent());
        dto.setMessageType(message.getMessageType() != null ? message.getMessageType().name() : "TEXT");
        dto.setMediaUrl(message.getMediaUrl());
        dto.setMediaName(message.getMediaName());
        dto.setStatus(message.getStatus() != null ? message.getStatus().name() : "SENT");
        dto.setCreatedAt(message.getCreatedAt());
        dto.setReadAt(message.getReadAt());
        return dto;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getSenderId() {
        return senderId;
    }

    public void setSenderId(UUID senderId) {
        this.senderId = senderId;
    }

    public String getSenderUsername() {
        return senderUsername;
    }

    public void setSenderUsername(String senderUsername) {
        this.senderUsername = senderUsername;
    }

    public String getSenderDisplayName() {
        return senderDisplayName;
    }

    public void setSenderDisplayName(String senderDisplayName) {
        this.senderDisplayName = senderDisplayName;
    }

    public String getSenderAvatarUrl() {
        return senderAvatarUrl;
    }

    public void setSenderAvatarUrl(String senderAvatarUrl) {
        this.senderAvatarUrl = senderAvatarUrl;
    }

    public UUID getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(UUID recipientId) {
        this.recipientId = recipientId;
    }

    public String getRecipientUsername() {
        return recipientUsername;
    }

    public void setRecipientUsername(String recipientUsername) {
        this.recipientUsername = recipientUsername;
    }

    public String getRecipientDisplayName() {
        return recipientDisplayName;
    }

    public void setRecipientDisplayName(String recipientDisplayName) {
        this.recipientDisplayName = recipientDisplayName;
    }

    public String getRecipientAvatarUrl() {
        return recipientAvatarUrl;
    }

    public void setRecipientAvatarUrl(String recipientAvatarUrl) {
        this.recipientAvatarUrl = recipientAvatarUrl;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getReadAt() {
        return readAt;
    }

    public void setReadAt(Instant readAt) {
        this.readAt = readAt;
    }
}
