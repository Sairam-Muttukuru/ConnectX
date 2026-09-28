package com.connectx.message.dto;

import java.time.Instant;
import java.util.UUID;

public class ConversationDto {

    private UUID partnerId;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String lastMessage;
    private Instant lastMessageTime;
    private UUID lastMessageSenderId;
    private String lastMessageType;
    private long unreadCount;
    private boolean online;
    private boolean isFriend;
    private Instant lastSeen;

    public ConversationDto() {
    }

    public ConversationDto(
            UUID partnerId,
            String username,
            String displayName,
            String avatarUrl,
            String lastMessage,
            Instant lastMessageTime,
            UUID lastMessageSenderId,
            String lastMessageType,
            long unreadCount,
            boolean online,
            boolean isFriend) {
        this.partnerId = partnerId;
        this.username = username;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.lastMessage = lastMessage;
        this.lastMessageTime = lastMessageTime;
        this.lastMessageSenderId = lastMessageSenderId;
        this.lastMessageType = lastMessageType;
        this.unreadCount = unreadCount;
        this.online = online;
        this.isFriend = isFriend;
    }

    public UUID getPartnerId() {
        return partnerId;
    }

    public void setPartnerId(UUID partnerId) {
        this.partnerId = partnerId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public Instant getLastMessageTime() {
        return lastMessageTime;
    }

    public void setLastMessageTime(Instant lastMessageTime) {
        this.lastMessageTime = lastMessageTime;
    }

    public UUID getLastMessageSenderId() {
        return lastMessageSenderId;
    }

    public void setLastMessageSenderId(UUID lastMessageSenderId) {
        this.lastMessageSenderId = lastMessageSenderId;
    }

    public String getLastMessageType() {
        return lastMessageType;
    }

    public void setLastMessageType(String lastMessageType) {
        this.lastMessageType = lastMessageType;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public boolean isFriend() {
        return isFriend;
    }

    public void setFriend(boolean friend) {
        isFriend = friend;
    }

    public Instant getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(Instant lastSeen) {
        this.lastSeen = lastSeen;
    }
}
