package com.connectx.dashboard.dto;

import java.util.UUID;

public class NotificationItemDto {

    private String id;
    private String category;
    private String title;
    private String desc;
    private String time;
    private String avatar;
    private String iconColor;
    private boolean unread;
    private boolean isRequest;
    private UUID requestId;
    private String activityType;

    public NotificationItemDto() {
    }

    public NotificationItemDto(String id, String category, String title, String desc, String time,
                               String avatar, String iconColor, boolean unread, boolean isRequest,
                               UUID requestId, String activityType) {
        this.id = id;
        this.category = category;
        this.title = title;
        this.desc = desc;
        this.time = time;
        this.avatar = avatar;
        this.iconColor = iconColor;
        this.unread = unread;
        this.isRequest = isRequest;
        this.requestId = requestId;
        this.activityType = activityType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDesc() {
        return desc;
    }

    public void setDesc(String desc) {
        this.desc = desc;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getIconColor() {
        return iconColor;
    }

    public void setIconColor(String iconColor) {
        this.iconColor = iconColor;
    }

    public boolean isUnread() {
        return unread;
    }

    public void setUnread(boolean unread) {
        this.unread = unread;
    }

    public boolean isRequest() {
        return isRequest;
    }

    public void setRequest(boolean request) {
        isRequest = request;
    }

    public UUID getRequestId() {
        return requestId;
    }

    public void setRequestId(UUID requestId) {
        this.requestId = requestId;
    }

    public String getActivityType() {
        return activityType;
    }

    public void setActivityType(String activityType) {
        this.activityType = activityType;
    }
}
