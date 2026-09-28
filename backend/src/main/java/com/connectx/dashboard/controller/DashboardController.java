package com.connectx.dashboard.controller;

import com.connectx.common.ApiResponse;
import com.connectx.dashboard.dto.DashboardHomeResponse;
import com.connectx.dashboard.dto.DashboardMetricsDto;
import com.connectx.dashboard.dto.UserSearchResultDto;
import com.connectx.dashboard.service.DashboardService;
import com.connectx.security.CustomUserPrincipal;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    private UUID getUserId(CustomUserPrincipal principal) {
        if (principal == null) {
            throw new org.springframework.security.access.AccessDeniedException("User must be authenticated");
        }
        return principal.getId();
    }

    @GetMapping("/home")
    public ResponseEntity<ApiResponse<DashboardHomeResponse>> getDashboardHome(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        DashboardHomeResponse response = dashboardService.getDashboardHome(userId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard home data retrieved successfully", response));
    }

    @GetMapping("/metrics")
    public ResponseEntity<ApiResponse<DashboardMetricsDto>> getDashboardMetrics(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        DashboardMetricsDto response = dashboardService.getDashboardMetrics(userId);
        return ResponseEntity.ok(ApiResponse.success("Dashboard metrics retrieved successfully", response));
    }

    @PostMapping("/requests/{requestId}/accept")
    public ResponseEntity<ApiResponse<Void>> acceptFriendRequest(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID requestId) {
        UUID userId = getUserId(principal);
        dashboardService.acceptFriendRequest(userId, requestId);
        return ResponseEntity.ok(ApiResponse.success("Friend request accepted", null));
    }

    @PostMapping("/requests/{requestId}/decline")
    public ResponseEntity<ApiResponse<Void>> declineFriendRequest(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID requestId) {
        UUID userId = getUserId(principal);
        dashboardService.declineFriendRequest(userId, requestId);
        return ResponseEntity.ok(ApiResponse.success("Friend request declined", null));
    }

    @PostMapping("/requests/send/{targetUserId}")
    public ResponseEntity<ApiResponse<Void>> sendFriendRequest(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID targetUserId) {
        UUID userId = getUserId(principal);
        dashboardService.sendFriendRequest(userId, targetUserId);
        return ResponseEntity.ok(ApiResponse.success("Friend request sent", null));
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<UserSearchResultDto>>> searchUsers(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestParam(required = false, defaultValue = "") String q) {
        UUID userId = getUserId(principal);
        List<UserSearchResultDto> results = dashboardService.searchUsers(userId, q);
        return ResponseEntity.ok(ApiResponse.success("User search completed", results));
    }

    @GetMapping("/friends")
    public ResponseEntity<ApiResponse<List<UserSearchResultDto>>> getFriends(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        List<UserSearchResultDto> friends = dashboardService.getFriends(userId);
        return ResponseEntity.ok(ApiResponse.success("Friends retrieved successfully", friends));
    }

    @GetMapping("/suggestions")
    public ResponseEntity<ApiResponse<List<UserSearchResultDto>>> getSuggestedUsers(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        List<UserSearchResultDto> suggestions = dashboardService.getSuggestedUsers(userId);
        return ResponseEntity.ok(ApiResponse.success("Suggested users retrieved successfully", suggestions));
    }

    @DeleteMapping("/friends/{friendId}")
    public ResponseEntity<ApiResponse<Void>> removeFriend(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID friendId) {
        UUID userId = getUserId(principal);
        dashboardService.removeFriend(userId, friendId);
        return ResponseEntity.ok(ApiResponse.success("Friend removed successfully", null));
    }

    @GetMapping("/notifications")
    public ResponseEntity<ApiResponse<List<com.connectx.dashboard.dto.NotificationItemDto>>> getNotifications(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        List<com.connectx.dashboard.dto.NotificationItemDto> notifications = dashboardService.getNotifications(userId);
        return ResponseEntity.ok(ApiResponse.success("Notifications retrieved successfully", notifications));
    }

    @GetMapping("/requests/received")
    public ResponseEntity<ApiResponse<List<com.connectx.dashboard.dto.FriendRequestItemDto>>> getReceivedRequests(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        List<com.connectx.dashboard.dto.FriendRequestItemDto> requests = dashboardService.getReceivedRequests(userId);
        return ResponseEntity.ok(ApiResponse.success("Received friend requests retrieved successfully", requests));
    }

    @GetMapping("/requests/sent")
    public ResponseEntity<ApiResponse<List<com.connectx.dashboard.dto.FriendRequestItemDto>>> getSentRequests(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        List<com.connectx.dashboard.dto.FriendRequestItemDto> requests = dashboardService.getSentRequests(userId);
        return ResponseEntity.ok(ApiResponse.success("Sent friend requests retrieved successfully", requests));
    }

    @DeleteMapping("/requests/sent/{requestId}")
    public ResponseEntity<ApiResponse<Void>> cancelSentRequest(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID requestId) {
        UUID userId = getUserId(principal);
        dashboardService.cancelSentRequest(userId, requestId);
        return ResponseEntity.ok(ApiResponse.success("Friend request cancelled successfully", null));
    }
}
