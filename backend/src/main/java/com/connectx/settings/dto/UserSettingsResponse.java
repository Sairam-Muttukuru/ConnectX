package com.connectx.settings.dto;

import com.connectx.settings.entity.UserSettings;
import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;

import java.time.Instant;
import java.util.UUID;

public class UserSettingsResponse {

    // User Profile
    private UUID userId;
    private String username;
    private String email;
    private String displayName;
    private String bio;
    private String avatarUrl;
    private boolean emailVerified;
    private AccountStatus accountStatus;

    // Notifications
    private boolean emailDirectMessages;
    private boolean emailMentions;
    private boolean emailConnections;
    private boolean emailWeeklyDigest;
    private boolean pushSounds;
    private boolean pushMessagePreview;
    private boolean pushNewConnections;
    private boolean pushGroupUpdates;

    // Appearance
    private String theme;
    private String accentColor;
    private boolean compactMode;
    private String messageFontSize;
    private String notificationRingtone;

    // Privacy
    private boolean privateAccount;
    private boolean showOnlineStatus;
    private boolean showReadReceipts;
    private String allowDirectMessages;
    private boolean searchEngineIndexing;

    // Security
    private boolean twoFactorEnabled;

    // Extended Profile
    private String location;
    private String education;
    private String occupation;
    private String website;
    private String customStatus;
    private String coverPhotoUrl;
    private String fieldOfStudy;
    private String aboutParagraph;

    private Instant updatedAt;

    public UserSettingsResponse() {
    }

    public static UserSettingsResponse from(User user, UserSettings settings) {
        UserSettingsResponse res = new UserSettingsResponse();
        res.setUserId(user.getId());
        res.setUsername(user.getUsername());
        res.setEmail(user.getEmail());
        res.setDisplayName(user.getDisplayName() != null ? user.getDisplayName() : user.getUsername());
        res.setBio(user.getBio() != null ? user.getBio() : "");
        res.setAvatarUrl(user.getAvatarUrl());
        res.setEmailVerified(user.isEmailVerified());
        res.setAccountStatus(user.getAccountStatus());

        if (settings != null) {
            res.setEmailDirectMessages(settings.isEmailDirectMessages());
            res.setEmailMentions(settings.isEmailMentions());
            res.setEmailConnections(settings.isEmailConnections());
            res.setEmailWeeklyDigest(settings.isEmailWeeklyDigest());
            res.setPushSounds(settings.isPushSounds());
            res.setPushMessagePreview(settings.isPushMessagePreview());
            res.setPushNewConnections(settings.isPushNewConnections());
            res.setPushGroupUpdates(settings.isPushGroupUpdates());

            res.setTheme(settings.getTheme());
            res.setAccentColor(settings.getAccentColor());
            res.setCompactMode(settings.isCompactMode());
            res.setMessageFontSize(settings.getMessageFontSize());
            res.setNotificationRingtone(settings.getNotificationRingtone());

            res.setPrivateAccount(settings.isPrivateAccount());
            res.setShowOnlineStatus(settings.isShowOnlineStatus());
            res.setShowReadReceipts(settings.isShowReadReceipts());
            res.setAllowDirectMessages(settings.getAllowDirectMessages());
            res.setSearchEngineIndexing(settings.isSearchEngineIndexing());

            res.setTwoFactorEnabled(settings.isTwoFactorEnabled());
            res.setLocation(settings.getLocation());
            res.setEducation(settings.getEducation());
            res.setOccupation(settings.getOccupation());
            res.setWebsite(settings.getWebsite());
            res.setCustomStatus(settings.getCustomStatus());
            res.setCoverPhotoUrl(settings.getCoverPhotoUrl());
            res.setFieldOfStudy(settings.getFieldOfStudy());
            res.setAboutParagraph(settings.getAboutParagraph());
            res.setUpdatedAt(settings.getUpdatedAt());
        }
        return res;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getBio() {
        return bio;
    }

    public void setBio(String bio) {
        this.bio = bio;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(String avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    public boolean isEmailVerified() {
        return emailVerified;
    }

    public void setEmailVerified(boolean emailVerified) {
        this.emailVerified = emailVerified;
    }

    public AccountStatus getAccountStatus() {
        return accountStatus;
    }

    public void setAccountStatus(AccountStatus accountStatus) {
        this.accountStatus = accountStatus;
    }

    public boolean isEmailDirectMessages() {
        return emailDirectMessages;
    }

    public void setEmailDirectMessages(boolean emailDirectMessages) {
        this.emailDirectMessages = emailDirectMessages;
    }

    public boolean isEmailMentions() {
        return emailMentions;
    }

    public void setEmailMentions(boolean emailMentions) {
        this.emailMentions = emailMentions;
    }

    public boolean isEmailConnections() {
        return emailConnections;
    }

    public void setEmailConnections(boolean emailConnections) {
        this.emailConnections = emailConnections;
    }

    public boolean isEmailWeeklyDigest() {
        return emailWeeklyDigest;
    }

    public void setEmailWeeklyDigest(boolean emailWeeklyDigest) {
        this.emailWeeklyDigest = emailWeeklyDigest;
    }

    public boolean isPushSounds() {
        return pushSounds;
    }

    public void setPushSounds(boolean pushSounds) {
        this.pushSounds = pushSounds;
    }

    public boolean isPushMessagePreview() {
        return pushMessagePreview;
    }

    public void setPushMessagePreview(boolean pushMessagePreview) {
        this.pushMessagePreview = pushMessagePreview;
    }

    public boolean isPushNewConnections() {
        return pushNewConnections;
    }

    public void setPushNewConnections(boolean pushNewConnections) {
        this.pushNewConnections = pushNewConnections;
    }

    public boolean isPushGroupUpdates() {
        return pushGroupUpdates;
    }

    public void setPushGroupUpdates(boolean pushGroupUpdates) {
        this.pushGroupUpdates = pushGroupUpdates;
    }

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public String getAccentColor() {
        return accentColor;
    }

    public void setAccentColor(String accentColor) {
        this.accentColor = accentColor;
    }

    public boolean isCompactMode() {
        return compactMode;
    }

    public void setCompactMode(boolean compactMode) {
        this.compactMode = compactMode;
    }

    public String getMessageFontSize() {
        return messageFontSize;
    }

    public void setMessageFontSize(String messageFontSize) {
        this.messageFontSize = messageFontSize;
    }

    public String getNotificationRingtone() {
        return notificationRingtone;
    }

    public void setNotificationRingtone(String notificationRingtone) {
        this.notificationRingtone = notificationRingtone;
    }

    public boolean isPrivateAccount() {
        return privateAccount;
    }

    public void setPrivateAccount(boolean privateAccount) {
        this.privateAccount = privateAccount;
    }

    public boolean isShowOnlineStatus() {
        return showOnlineStatus;
    }

    public void setShowOnlineStatus(boolean showOnlineStatus) {
        this.showOnlineStatus = showOnlineStatus;
    }

    public boolean isShowReadReceipts() {
        return showReadReceipts;
    }

    public void setShowReadReceipts(boolean showReadReceipts) {
        this.showReadReceipts = showReadReceipts;
    }

    public String getAllowDirectMessages() {
        return allowDirectMessages;
    }

    public void setAllowDirectMessages(String allowDirectMessages) {
        this.allowDirectMessages = allowDirectMessages;
    }

    public boolean isSearchEngineIndexing() {
        return searchEngineIndexing;
    }

    public void setSearchEngineIndexing(boolean searchEngineIndexing) {
        this.searchEngineIndexing = searchEngineIndexing;
    }

    public boolean isTwoFactorEnabled() {
        return twoFactorEnabled;
    }

    public void setTwoFactorEnabled(boolean twoFactorEnabled) {
        this.twoFactorEnabled = twoFactorEnabled;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getEducation() {
        return education;
    }

    public void setEducation(String education) {
        this.education = education;
    }

    public String getOccupation() {
        return occupation;
    }

    public void setOccupation(String occupation) {
        this.occupation = occupation;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getCustomStatus() {
        return customStatus;
    }

    public void setCustomStatus(String customStatus) {
        this.customStatus = customStatus;
    }

    public String getCoverPhotoUrl() {
        return coverPhotoUrl;
    }

    public void setCoverPhotoUrl(String coverPhotoUrl) {
        this.coverPhotoUrl = coverPhotoUrl;
    }

    public String getFieldOfStudy() {
        return fieldOfStudy;
    }

    public void setFieldOfStudy(String fieldOfStudy) {
        this.fieldOfStudy = fieldOfStudy;
    }

    public String getAboutParagraph() {
        return aboutParagraph;
    }

    public void setAboutParagraph(String aboutParagraph) {
        this.aboutParagraph = aboutParagraph;
    }
}
