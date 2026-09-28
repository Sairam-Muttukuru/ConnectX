package com.connectx.dashboard.dto;

public class TodayEventItemDto {

    private String id;
    private String title;
    private String time;
    private String iconType;
    private String color;

    public TodayEventItemDto() {
    }

    public TodayEventItemDto(String id, String title, String time, String iconType, String color) {
        this.id = id;
        this.title = title;
        this.time = time;
        this.iconType = iconType;
        this.color = color;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getIconType() {
        return iconType;
    }

    public void setIconType(String iconType) {
        this.iconType = iconType;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }
}
