package com.connectx.dashboard.service;

import com.connectx.dashboard.dto.DashboardHomeResponse;
import com.connectx.dashboard.dto.DashboardMetricsDto;
import com.connectx.dashboard.dto.UserSearchResultDto;

import java.util.List;
import java.util.UUID;

public interface DashboardService {

    DashboardHomeResponse getDashboardHome(UUID userId);

    DashboardMetricsDto getDashboardMetrics(UUID userId);

    void acceptFriendRequest(UUID userId, UUID requestId);

    void declineFriendRequest(UUID userId, UUID requestId);

    void sendFriendRequest(UUID userId, UUID targetUserId);

    List<UserSearchResultDto> searchUsers(UUID currentUserId, String query);

    List<UserSearchResultDto> getFriends(UUID currentUserId);

    List<UserSearchResultDto> getSuggestedUsers(UUID currentUserId);

    void removeFriend(UUID currentUserId, UUID friendId);

    List<com.connectx.dashboard.dto.NotificationItemDto> getNotifications(UUID currentUserId);

    List<com.connectx.dashboard.dto.FriendRequestItemDto> getReceivedRequests(UUID currentUserId);

    List<com.connectx.dashboard.dto.FriendRequestItemDto> getSentRequests(UUID currentUserId);

    void cancelSentRequest(UUID currentUserId, UUID requestId);
}
