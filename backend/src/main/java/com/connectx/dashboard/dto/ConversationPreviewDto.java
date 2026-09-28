package com.connectx.dashboard.dto;

public class ConversationPreviewDto {

    private String id;
    private String name;
    private String username;
    private String avatar;
    private String lastMessage;
    private String time;
    private int unread;
    private boolean online;

    public ConversationPreviewDto() {
    }

    public ConversationPreviewDto(String id, String name, String username, String avatar, String lastMessage, String time, int unread, boolean online) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.avatar = avatar;
        this.lastMessage = lastMessage;
        this.time = time;
        this.unread = unread;
        this.online = online;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public int getUnread() {
        return unread;
    }

    public void setUnread(int unread) {
        this.unread = unread;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}
