package com.connectx.dashboard.dto;

import java.util.UUID;

public class UserSearchResultDto {

    private UUID id;
    private String username;
    private String displayName;
    private String avatarUrl;
    private String bio;
    private boolean isFriend;
    private boolean isPending;
    private boolean online;
    private java.time.Instant lastSeen;

    public UserSearchResultDto() {
    }

    public UserSearchResultDto(UUID id, String username, String displayName, String avatarUrl, String bio, boolean isFriend, boolean isPending) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.avatarUrl = avatarUrl;
        this.bio = bio;
        this.isFriend = isFriend;
        this.isPending = isPending;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
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

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public boolean isFriend() {
        return isFriend;
    }

    public void setFriend(boolean friend) {
        isFriend = friend;
    }

    public boolean isPending() {
        return isPending;
    }

    public void setPending(boolean pending) {
        isPending = pending;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public java.time.Instant getLastSeen() {
        return lastSeen;
    }

    public void setLastSeen(java.time.Instant lastSeen) {
        this.lastSeen = lastSeen;
    }
}
