package com.connectx.message.dto;

import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public class SendMessageRequest {

    @NotNull(message = "Recipient ID is required")
    private UUID recipientId;

    private String content;

    private String messageType = "TEXT";

    private String mediaUrl;

    private String mediaName;

    public SendMessageRequest() {
    }

    public SendMessageRequest(UUID recipientId, String content) {
        this.recipientId = recipientId;
        this.content = content;
        this.messageType = "TEXT";
    }

    public UUID getRecipientId() {
        return recipientId;
    }

    public void setRecipientId(UUID recipientId) {
        this.recipientId = recipientId;
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
}
