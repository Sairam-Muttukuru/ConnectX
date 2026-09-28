package com.connectx.dashboard.dto;

import java.util.List;

public class DashboardMetricsDto {

    private int unreadMessagesCount;
    private int friendsCount;
    private int friendRequestsCount;
    private int notificationsCount;
    private List<String> friendAvatars;
    private String extraFriendsText;
    private List<String> requestAvatars;
    private String extraRequestsText;

    public DashboardMetricsDto() {
    }

    public DashboardMetricsDto(int unreadMessagesCount, int friendsCount, int friendRequestsCount, int notificationsCount,
                               List<String> friendAvatars, String extraFriendsText,
                               List<String> requestAvatars, String extraRequestsText) {
        this.unreadMessagesCount = unreadMessagesCount;
        this.friendsCount = friendsCount;
        this.friendRequestsCount = friendRequestsCount;
        this.notificationsCount = notificationsCount;
        this.friendAvatars = friendAvatars;
        this.extraFriendsText = extraFriendsText;
        this.requestAvatars = requestAvatars;
        this.extraRequestsText = extraRequestsText;
    }

    public int getUnreadMessagesCount() {
        return unreadMessagesCount;
    }

    public void setUnreadMessagesCount(int unreadMessagesCount) {
        this.unreadMessagesCount = unreadMessagesCount;
    }

    public int getFriendsCount() {
        return friendsCount;
    }

    public void setFriendsCount(int friendsCount) {
        this.friendsCount = friendsCount;
    }

    public int getFriendRequestsCount() {
        return friendRequestsCount;
    }

    public void setFriendRequestsCount(int friendRequestsCount) {
        this.friendRequestsCount = friendRequestsCount;
    }

    public int getNotificationsCount() {
        return notificationsCount;
    }

    public void setNotificationsCount(int notificationsCount) {
        this.notificationsCount = notificationsCount;
    }

    public List<String> getFriendAvatars() {
        return friendAvatars;
    }

    public void setFriendAvatars(List<String> friendAvatars) {
        this.friendAvatars = friendAvatars;
    }

    public String getExtraFriendsText() {
        return extraFriendsText;
    }

    public void setExtraFriendsText(String extraFriendsText) {
        this.extraFriendsText = extraFriendsText;
    }

    public List<String> getRequestAvatars() {
        return requestAvatars;
    }

    public void setRequestAvatars(List<String> requestAvatars) {
        this.requestAvatars = requestAvatars;
    }

    public String getExtraRequestsText() {
        return extraRequestsText;
    }

    public void setExtraRequestsText(String extraRequestsText) {
        this.extraRequestsText = extraRequestsText;
    }
}
