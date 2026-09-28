package com.connectx.dashboard.dto;

public class RecentActivityItemDto {

    private String id;
    private String name;
    private String avatar;
    private String action;
    private String time;
    private String type;
    private String iconColor;

    public RecentActivityItemDto() {
    }

    public RecentActivityItemDto(String id, String name, String avatar, String action, String time, String type, String iconColor) {
        this.id = id;
        this.name = name;
        this.avatar = avatar;
        this.action = action;
        this.time = time;
        this.type = type;
        this.iconColor = iconColor;
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

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getIconColor() {
        return iconColor;
    }

    public void setIconColor(String iconColor) {
        this.iconColor = iconColor;
    }
}
