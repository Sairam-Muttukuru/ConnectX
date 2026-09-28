package com.connectx.dashboard.dto;

public class OnlineFriendDto {

    private String id;
    private String name;
    private String username;
    private String avatar;
    private boolean online;

    public OnlineFriendDto() {
    }

    public OnlineFriendDto(String id, String name, String username, String avatar, boolean online) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.avatar = avatar;
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

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}
