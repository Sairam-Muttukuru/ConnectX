package com.connectx.settings.controller;

import com.connectx.common.ApiResponse;
import com.connectx.security.CustomUserPrincipal;
import com.connectx.settings.dto.*;
import com.connectx.settings.service.SettingsService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    private UUID getUserId(CustomUserPrincipal principal) {
        if (principal == null) {
            throw new org.springframework.security.access.AccessDeniedException("User must be authenticated");
        }
        return principal.getId();
    }

    @GetMapping
    public ResponseEntity<ApiResponse<UserSettingsResponse>> getSettings(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.getSettings(userId);
        return ResponseEntity.ok(ApiResponse.success("Settings retrieved successfully", response));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateProfile(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody UpdateProfileRequest request) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Profile updated successfully", response));
    }

    @PutMapping("/password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @Valid @RequestBody ChangePasswordRequest request) {
        UUID userId = getUserId(principal);
        settingsService.changePassword(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Password changed successfully", null));
    }

    @PostMapping("/2fa/toggle")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> toggle2FA(
            @AuthenticationPrincipal CustomUserPrincipal principal) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.toggle2FA(userId);
        String msg = response.isTwoFactorEnabled() ? "Two-factor authentication enabled" : "Two-factor authentication disabled";
        return ResponseEntity.ok(ApiResponse.success(msg, response));
    }

    @PutMapping("/notifications")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateNotifications(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdateNotificationsRequest request) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.updateNotifications(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Notification preferences updated", response));
    }

    @PutMapping("/appearance")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updateAppearance(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdateAppearanceRequest request) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.updateAppearance(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Appearance settings updated", response));
    }

    @PutMapping("/privacy")
    public ResponseEntity<ApiResponse<UserSettingsResponse>> updatePrivacy(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @RequestBody UpdatePrivacyRequest request) {
        UUID userId = getUserId(principal);
        UserSettingsResponse response = settingsService.updatePrivacy(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Privacy preferences updated", response));
    }

    @GetMapping("/devices")
    public ResponseEntity<ApiResponse<List<ConnectedDeviceDto>>> getConnectedDevices(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            HttpServletRequest request) {
        UUID userId = getUserId(principal);
        List<ConnectedDeviceDto> devices = settingsService.getConnectedDevices(userId, request);
        return ResponseEntity.ok(ApiResponse.success("Connected devices retrieved", devices));
    }

    @DeleteMapping("/devices/{id}")
    public ResponseEntity<ApiResponse<Void>> revokeDeviceSession(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            @PathVariable UUID id) {
        UUID userId = getUserId(principal);
        settingsService.revokeDeviceSession(userId, id);
        return ResponseEntity.ok(ApiResponse.success("Device session revoked successfully", null));
    }

    @PostMapping("/devices/revoke-others")
    public ResponseEntity<ApiResponse<Void>> revokeAllOtherSessions(
            @AuthenticationPrincipal CustomUserPrincipal principal,
            HttpServletRequest request) {
        UUID userId = getUserId(principal);
        settingsService.revokeAllOtherSessions(userId, request);
        return ResponseEntity.ok(ApiResponse.success("All other sessions revoked successfully", null));
    }
}
