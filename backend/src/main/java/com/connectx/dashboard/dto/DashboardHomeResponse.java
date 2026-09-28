package com.connectx.dashboard.dto;

import java.util.List;

public class DashboardHomeResponse {

    private DashboardMetricsDto metrics;
    private List<ConversationPreviewDto> recentConversations;
    private List<OnlineFriendDto> onlineFriends;
    private List<FriendRequestItemDto> friendRequests;
    private List<RecentActivityItemDto> recentActivity;
    private List<TodayEventItemDto> todayEvents;

    public DashboardHomeResponse() {
    }

    public DashboardHomeResponse(DashboardMetricsDto metrics,
                                 List<ConversationPreviewDto> recentConversations,
                                 List<OnlineFriendDto> onlineFriends,
                                 List<FriendRequestItemDto> friendRequests,
                                 List<RecentActivityItemDto> recentActivity,
                                 List<TodayEventItemDto> todayEvents) {
        this.metrics = metrics;
        this.recentConversations = recentConversations;
        this.onlineFriends = onlineFriends;
        this.friendRequests = friendRequests;
        this.recentActivity = recentActivity;
        this.todayEvents = todayEvents;
    }

    public DashboardMetricsDto getMetrics() {
        return metrics;
    }

    public void setMetrics(DashboardMetricsDto metrics) {
        this.metrics = metrics;
    }

    public List<ConversationPreviewDto> getRecentConversations() {
        return recentConversations;
    }

    public void setRecentConversations(List<ConversationPreviewDto> recentConversations) {
        this.recentConversations = recentConversations;
    }

    public List<OnlineFriendDto> getOnlineFriends() {
        return onlineFriends;
    }

    public void setOnlineFriends(List<OnlineFriendDto> onlineFriends) {
        this.onlineFriends = onlineFriends;
    }

    public List<FriendRequestItemDto> getFriendRequests() {
        return friendRequests;
    }

    public void setFriendRequests(List<FriendRequestItemDto> friendRequests) {
        this.friendRequests = friendRequests;
    }

    public List<RecentActivityItemDto> getRecentActivity() {
        return recentActivity;
    }

    public void setRecentActivity(List<RecentActivityItemDto> recentActivity) {
        this.recentActivity = recentActivity;
    }

    public List<TodayEventItemDto> getTodayEvents() {
        return todayEvents;
    }

    public void setTodayEvents(List<TodayEventItemDto> todayEvents) {
        this.todayEvents = todayEvents;
    }
}
