package com.connectx.settings.service.impl;

import com.connectx.auth.entity.RefreshToken;
import com.connectx.auth.repository.RefreshTokenRepository;
import com.connectx.exception.BadRequestException;
import com.connectx.exception.DuplicateResourceException;
import com.connectx.exception.ResourceNotFoundException;
import com.connectx.settings.dto.*;
import com.connectx.settings.entity.UserDevice;
import com.connectx.settings.entity.UserSettings;
import com.connectx.settings.repository.UserDeviceRepository;
import com.connectx.settings.repository.UserSettingsRepository;
import com.connectx.settings.service.SettingsService;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
@Transactional
public class SettingsServiceImpl implements SettingsService {

    private final UserRepository userRepository;
    private final UserSettingsRepository userSettingsRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserDeviceRepository userDeviceRepository;
    private final PasswordEncoder passwordEncoder;

    public SettingsServiceImpl(
            UserRepository userRepository,
            UserSettingsRepository userSettingsRepository,
            RefreshTokenRepository refreshTokenRepository,
            UserDeviceRepository userDeviceRepository,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userSettingsRepository = userSettingsRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.userDeviceRepository = userDeviceRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private User getUser(UUID userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
    }

    private UserSettings getOrCreateSettings(UUID userId) {
        return userSettingsRepository.findByUserId(userId)
                .orElseGet(() -> userSettingsRepository.save(new UserSettings(userId)));
    }

    @Override
    @Transactional(readOnly = true)
    public UserSettingsResponse getSettings(UUID userId) {
        User user = getUser(userId);
        UserSettings settings = getOrCreateSettings(userId);
        return UserSettingsResponse.from(user, settings);
    }

    @Override
    public UserSettingsResponse updateProfile(UUID userId, UpdateProfileRequest request) {
        User user = getUser(userId);

        if (request.getDisplayName() != null && !request.getDisplayName().trim().isEmpty()) {
            user.setDisplayName(request.getDisplayName().trim());
        }

        if (request.getBio() != null) {
            user.setBio(request.getBio().trim());
        }

        if (request.getAvatarUrl() != null && !request.getAvatarUrl().trim().isEmpty()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        if (request.getUsername() != null && !request.getUsername().trim().isEmpty()) {
            String newUsername = request.getUsername().trim().toLowerCase();
            if (!newUsername.equalsIgnoreCase(user.getUsername())) {
                if (userRepository.existsByUsername(newUsername)) {
                    throw new DuplicateResourceException("Username '" + newUsername + "' is already taken");
                }
                user.setUsername(newUsername);
            }
        }

        if (request.getEmail() != null && !request.getEmail().trim().isEmpty()) {
            String newEmail = request.getEmail().trim().toLowerCase();
            if (!newEmail.equalsIgnoreCase(user.getEmail())) {
                if (userRepository.existsByEmail(newEmail)) {
                    throw new DuplicateResourceException("Email '" + newEmail + "' is already registered");
                }
                user.setEmail(newEmail);
            }
        }

        user = userRepository.save(user);
        UserSettings settings = getOrCreateSettings(userId);

        if (request.getLocation() != null) {
            settings.setLocation(request.getLocation().trim());
        }
        if (request.getEducation() != null) {
            settings.setEducation(request.getEducation().trim());
        }
        if (request.getOccupation() != null) {
            settings.setOccupation(request.getOccupation().trim());
        }
        if (request.getWebsite() != null) {
            settings.setWebsite(request.getWebsite().trim());
        }
        if (request.getCustomStatus() != null) {
            settings.setCustomStatus(request.getCustomStatus().trim());
        }
        if (request.getCoverPhotoUrl() != null && !request.getCoverPhotoUrl().trim().isEmpty()) {
            settings.setCoverPhotoUrl(request.getCoverPhotoUrl().trim());
        }
        if (request.getFieldOfStudy() != null) {
            settings.setFieldOfStudy(request.getFieldOfStudy().trim());
        }
        if (request.getAboutParagraph() != null) {
            settings.setAboutParagraph(request.getAboutParagraph().trim());
        }

        settings = userSettingsRepository.save(settings);
        return UserSettingsResponse.from(user, settings);
    }

    @Override
    public void changePassword(UUID userId, ChangePasswordRequest request) {
        User user = getUser(userId);

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (!request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        if (passwordEncoder.matches(request.getNewPassword(), user.getPasswordHash())) {
            throw new BadRequestException("New password must be different from current password");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }

    @Override
    public UserSettingsResponse toggle2FA(UUID userId) {
        User user = getUser(userId);
        UserSettings settings = getOrCreateSettings(userId);
        settings.setTwoFactorEnabled(!settings.isTwoFactorEnabled());
        settings = userSettingsRepository.save(settings);
        return UserSettingsResponse.from(user, settings);
    }

    @Override
    public UserSettingsResponse updateNotifications(UUID userId, UpdateNotificationsRequest request) {
        User user = getUser(userId);
        UserSettings settings = getOrCreateSettings(userId);

        if (request.getEmailDirectMessages() != null) {
            settings.setEmailDirectMessages(request.getEmailDirectMessages());
        }
        if (request.getEmailMentions() != null) {
            settings.setEmailMentions(request.getEmailMentions());
        }
        if (request.getEmailConnections() != null) {
            settings.setEmailConnections(request.getEmailConnections());
        }
        if (request.getEmailWeeklyDigest() != null) {
            settings.setEmailWeeklyDigest(request.getEmailWeeklyDigest());
        }
        if (request.getPushSounds() != null) {
            settings.setPushSounds(request.getPushSounds());
        }
        if (request.getPushMessagePreview() != null) {
            settings.setPushMessagePreview(request.getPushMessagePreview());
        }
        if (request.getPushNewConnections() != null) {
            settings.setPushNewConnections(request.getPushNewConnections());
        }
        if (request.getPushGroupUpdates() != null) {
            settings.setPushGroupUpdates(request.getPushGroupUpdates());
        }
        if (request.getNotificationRingtone() != null && !request.getNotificationRingtone().trim().isEmpty()) {
            settings.setNotificationRingtone(request.getNotificationRingtone().trim());
        }

        settings = userSettingsRepository.save(settings);
        return UserSettingsResponse.from(user, settings);
    }

    @Override
    public UserSettingsResponse updateAppearance(UUID userId, UpdateAppearanceRequest request) {
        User user = getUser(userId);
        UserSettings settings = getOrCreateSettings(userId);

        if (request.getTheme() != null && !request.getTheme().trim().isEmpty()) {
            settings.setTheme(request.getTheme().trim());
        }
        if (request.getAccentColor() != null && !request.getAccentColor().trim().isEmpty()) {
            settings.setAccentColor(request.getAccentColor().trim());
        }
        if (request.getCompactMode() != null) {
            settings.setCompactMode(request.getCompactMode());
        }
        if (request.getMessageFontSize() != null && !request.getMessageFontSize().trim().isEmpty()) {
            settings.setMessageFontSize(request.getMessageFontSize().trim());
        }

        settings = userSettingsRepository.save(settings);
        return UserSettingsResponse.from(user, settings);
    }

    @Override
    public UserSettingsResponse updatePrivacy(UUID userId, UpdatePrivacyRequest request) {
        User user = getUser(userId);
        UserSettings settings = getOrCreateSettings(userId);

        if (request.getPrivateAccount() != null) {
            settings.setPrivateAccount(request.getPrivateAccount());
        }
        if (request.getShowOnlineStatus() != null) {
            settings.setShowOnlineStatus(request.getShowOnlineStatus());
        }
        if (request.getShowReadReceipts() != null) {
            settings.setShowReadReceipts(request.getShowReadReceipts());
        }
        if (request.getAllowDirectMessages() != null && !request.getAllowDirectMessages().trim().isEmpty()) {
            settings.setAllowDirectMessages(request.getAllowDirectMessages().trim());
        }
        if (request.getSearchEngineIndexing() != null) {
            settings.setSearchEngineIndexing(request.getSearchEngineIndexing());
        }

        settings = userSettingsRepository.save(settings);
        return UserSettingsResponse.from(user, settings);
    }

    private String getClientIp(HttpServletRequest request) {
        String xf = request.getHeader("X-Forwarded-For");
        if (xf != null && !xf.isEmpty()) {
            return xf.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }

    private String formatIp(String ip) {
        if (ip == null || ip.isEmpty() || "0:0:0:0:0:0:0:1".equals(ip) || "::1".equals(ip) || "127.0.0.1".equals(ip)) {
            return "127.0.0.1 (Localhost)";
        }
        return ip;
    }

    private String resolveDeviceName(String rawName, String ua) {
        if (rawName != null && !rawName.isEmpty() && !"Web Browser".equalsIgnoreCase(rawName) && !"Unknown".equalsIgnoreCase(rawName)) {
            return rawName;
        }
        if (ua == null || ua.isEmpty()) {
            return "Google Chrome on Windows";
        }
        String browser = "Browser";
        if (ua.contains("Edg/")) browser = "Microsoft Edge";
        else if (ua.contains("Chrome/")) browser = "Google Chrome";
        else if (ua.contains("Firefox/")) browser = "Mozilla Firefox";
        else if (ua.contains("Safari/") && !ua.contains("Chrome")) browser = "Apple Safari";

        return browser + " on " + getOs(ua);
    }

    private String getClientDeviceName(HttpServletRequest request) {
        String ua = request.getHeader("User-Agent");
        return resolveDeviceName(null, ua);
    }

    private String getOs(String ua) {
        if (ua.contains("Windows NT 10.0") || ua.contains("Windows NT 11.0") || ua.contains("Windows")) return "Windows 11";
        if (ua.contains("Macintosh") || ua.contains("Mac OS")) return "macOS";
        if (ua.contains("iPhone")) return "iOS";
        if (ua.contains("Android")) return "Android";
        if (ua.contains("Linux")) return "Linux";
        return "Windows";
    }

    @Override
    public List<ConnectedDeviceDto> getConnectedDevices(UUID userId, HttpServletRequest request) {
        String currentIp = formatIp(getClientIp(request));
        String currentUa = request.getHeader("User-Agent");
        String currentDeviceName = getClientDeviceName(request);
        String currentOs = currentUa != null ? getOs(currentUa) : "Windows 11";
        String currentBrowser = "Chrome";
        if (currentUa != null) {
            if (currentUa.contains("Edg/")) currentBrowser = "Microsoft Edge";
            else if (currentUa.contains("Firefox/")) currentBrowser = "Firefox";
            else if (currentUa.contains("Safari/") && !currentUa.contains("Chrome")) currentBrowser = "Safari";
        }

        // Reset current session flags for this user in DB
        userDeviceRepository.resetCurrentSessionForUser(userId);

        // Find existing device or create new
        Optional<UserDevice> existingCurrent = userDeviceRepository.findByUserIdAndDeviceName(userId, currentDeviceName);
        UserDevice currentDevice;
        if (existingCurrent.isPresent()) {
            currentDevice = existingCurrent.get();
            currentDevice.setActive(true);
            currentDevice.setCurrentSession(true);
            currentDevice.setIpAddress(currentIp);
            currentDevice.setUserAgent(currentUa);
            currentDevice.setLastActive(Instant.now());
            currentDevice = userDeviceRepository.save(currentDevice);
        } else {
            currentDevice = new UserDevice(
                    userId,
                    currentDeviceName,
                    "Desktop",
                    currentBrowser,
                    currentOs,
                    currentIp,
                    currentUa != null ? currentUa : "Current Session",
                    true
            );
            currentDevice = userDeviceRepository.save(currentDevice);
        }

        // Fetch all active devices for this user from DB
        List<UserDevice> activeDevices = userDeviceRepository.findAllByUserIdAndActiveTrueOrderByLastActiveDesc(userId);

        // Seed older refresh token session if only 1 device is recorded yet
        if (activeDevices.size() == 1) {
            List<RefreshToken> tokens = refreshTokenRepository.findAllByUserIdAndRevokedAtIsNullOrderByCreatedAtDesc(userId);
            for (RefreshToken rt : tokens) {
                String tokenDeviceName = resolveDeviceName(rt.getDeviceName(), rt.getUserAgent());
                if (!tokenDeviceName.equalsIgnoreCase(currentDeviceName)) {
                    UserDevice extra = new UserDevice(
                            userId,
                            tokenDeviceName,
                            "Desktop",
                            "Edge",
                            "Windows 11",
                            formatIp(rt.getIpAddress()),
                            rt.getUserAgent() != null ? rt.getUserAgent() : "Edge Browser",
                            false
                    );
                    extra.setLastActive(rt.getCreatedAt());
                    userDeviceRepository.save(extra);
                }
            }
            activeDevices = userDeviceRepository.findAllByUserIdAndActiveTrueOrderByLastActiveDesc(userId);
        }

        List<ConnectedDeviceDto> result = new ArrayList<>();
        for (UserDevice dev : activeDevices) {
            result.add(new ConnectedDeviceDto(
                    dev.getId(),
                    dev.getDeviceName(),
                    dev.getUserAgent() != null ? dev.getUserAgent() : (dev.getBrowser() + " on " + dev.getOperatingSystem()),
                    dev.getIpAddress(),
                    dev.getCreatedAt(),
                    dev.getLastActive(),
                    dev.isCurrentSession()
            ));
        }

        return result;
    }

    @Override
    public void revokeDeviceSession(UUID userId, UUID sessionId) {
        userDeviceRepository.deactivateByIdAndUserId(sessionId, userId);
        refreshTokenRepository.revokeByIdAndUserId(sessionId, userId, Instant.now());
    }

    @Override
    public void revokeAllOtherSessions(UUID userId, HttpServletRequest request) {
        String currentDeviceName = getClientDeviceName(request);
        Optional<UserDevice> current = userDeviceRepository.findByUserIdAndDeviceName(userId, currentDeviceName);
        if (current.isPresent()) {
            userDeviceRepository.deactivateOtherDevices(userId, current.get().getId());
        } else {
            List<UserDevice> list = userDeviceRepository.findAllByUserIdAndActiveTrueOrderByLastActiveDesc(userId);
            if (!list.isEmpty()) {
                userDeviceRepository.deactivateOtherDevices(userId, list.get(0).getId());
            }
        }
        refreshTokenRepository.revokeAllByUserId(userId, Instant.now());
    }
}
