package com.connectx.settings.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "user_settings",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_user_settings_user_id", columnNames = "user_id")
    },
    indexes = {
        @Index(name = "idx_user_settings_user_id", columnList = "user_id")
    }
)
public class UserSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false, unique = true)
    private UUID userId;

    // Email Notifications
    @Column(name = "email_direct_messages", nullable = false)
    private boolean emailDirectMessages = true;

    @Column(name = "email_mentions", nullable = false)
    private boolean emailMentions = true;

    @Column(name = "email_connections", nullable = false)
    private boolean emailConnections = true;

    @Column(name = "email_weekly_digest", nullable = false)
    private boolean emailWeeklyDigest = false;

    // Push Notifications
    @Column(name = "push_sounds", nullable = false)
    private boolean pushSounds = true;

    @Column(name = "push_message_preview", nullable = false)
    private boolean pushMessagePreview = true;

    @Column(name = "push_new_connections", nullable = false)
    private boolean pushNewConnections = true;

    @Column(name = "push_group_updates", nullable = false)
    private boolean pushGroupUpdates = true;

    // Appearance
    @Column(name = "theme", length = 20, nullable = false)
    private String theme = "dark";

    @Column(name = "accent_color", length = 30, nullable = false)
    private String accentColor = "purple";

    @Column(name = "compact_mode", nullable = false)
    private boolean compactMode = false;

    @Column(name = "message_font_size", length = 20, nullable = false)
    private String messageFontSize = "medium";

    @Column(name = "notification_ringtone", length = 100)
    private String notificationRingtone = "ConnectX Chime (Default)";

    // Privacy
    @Column(name = "private_account", nullable = false)
    private boolean privateAccount = false;

    @Column(name = "show_online_status", nullable = false)
    private boolean showOnlineStatus = true;

    @Column(name = "show_read_receipts", nullable = false)
    private boolean showReadReceipts = true;

    @Column(name = "allow_direct_messages", length = 30, nullable = false)
    private String allowDirectMessages = "EVERYONE";

    @Column(name = "search_engine_indexing", nullable = false)
    private boolean searchEngineIndexing = false;

    // Security
    @Column(name = "two_factor_enabled", nullable = false)
    private boolean twoFactorEnabled = false;

    // Extended Profile Information
    @Column(name = "location", length = 150)
    private String location = "Nellore, Andhra Pradesh, India";

    @Column(name = "education", length = 150)
    private String education = "Narayana Engineering College";

    @Column(name = "occupation", length = 100)
    private String occupation = "Software Developer";

    @Column(name = "website", length = 255)
    private String website = "https://www.linkedin.com/in/sairam-muttukuru/";

    @Column(name = "custom_status", length = 150)
    private String customStatus = "Coding today, connections tomorrow 💻";

    @Column(name = "cover_photo_url", columnDefinition = "TEXT")
    private String coverPhotoUrl = "/images/dashboard/profile_cover_banner.jpg";

    @Column(name = "field_of_study", length = 100)
    private String fieldOfStudy = "Computer Science";

    @Column(name = "about_paragraph", columnDefinition = "TEXT")
    private String aboutParagraph = "Hey! I'm Sairam.\nI'm a Computer Science graduate who loves technology, building cool projects, and connecting with interesting people.\n\nHere to make real connections — no phone numbers, just people. 🤝";

    // Timestamps
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    public UserSettings() {
    }

    public UserSettings(UUID userId) {
        this.userId = userId;
        this.emailDirectMessages = true;
        this.emailMentions = true;
        this.emailConnections = true;
        this.emailWeeklyDigest = false;
        this.pushSounds = true;
        this.pushMessagePreview = true;
        this.pushNewConnections = true;
        this.pushGroupUpdates = true;
        this.theme = "dark";
        this.accentColor = "purple";
        this.compactMode = false;
        this.messageFontSize = "medium";
        this.privateAccount = false;
        this.showOnlineStatus = true;
        this.showReadReceipts = true;
        this.allowDirectMessages = "EVERYONE";
        this.searchEngineIndexing = false;
        this.twoFactorEnabled = false;
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        this.updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = Instant.now();
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public UUID getUserId() {
        return userId;
    }

    public void setUserId(UUID userId) {
        this.userId = userId;
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

    public String getNotificationRingtone() {
        return notificationRingtone;
    }

    public void setNotificationRingtone(String notificationRingtone) {
        this.notificationRingtone = notificationRingtone;
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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
