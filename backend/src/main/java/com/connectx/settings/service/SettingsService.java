package com.connectx.settings.service;

import com.connectx.settings.dto.*;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.UUID;

public interface SettingsService {

    UserSettingsResponse getSettings(UUID userId);

    UserSettingsResponse updateProfile(UUID userId, UpdateProfileRequest request);

    void changePassword(UUID userId, ChangePasswordRequest request);

    UserSettingsResponse toggle2FA(UUID userId);

    UserSettingsResponse updateNotifications(UUID userId, UpdateNotificationsRequest request);

    UserSettingsResponse updateAppearance(UUID userId, UpdateAppearanceRequest request);

    UserSettingsResponse updatePrivacy(UUID userId, UpdatePrivacyRequest request);

    List<ConnectedDeviceDto> getConnectedDevices(UUID userId, HttpServletRequest request);

    void revokeDeviceSession(UUID userId, UUID sessionId);

    void revokeAllOtherSessions(UUID userId, HttpServletRequest request);
}
