package com.connectx.dashboard.dto;

public class FriendRequestItemDto {

    private String id;
    private String requesterId;
    private String name;
    private String username;
    private String mutual;
    private String avatar;
    private String time;
    private boolean online;

    public FriendRequestItemDto() {
    }

    public FriendRequestItemDto(String id, String requesterId, String name, String username, String mutual, String avatar) {
        this(id, requesterId, name, username, mutual, avatar, "Recently", true);
    }

    public FriendRequestItemDto(String id, String requesterId, String name, String username, String mutual, String avatar, String time, boolean online) {
        this.id = id;
        this.requesterId = requesterId;
        this.name = name;
        this.username = username;
        this.mutual = mutual;
        this.avatar = avatar;
        this.time = time;
        this.online = online;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRequesterId() {
        return requesterId;
    }

    public void setRequesterId(String requesterId) {
        this.requesterId = requesterId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getMutual() {
        return mutual;
    }

    public void setMutual(String mutual) {
        this.mutual = mutual;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}
