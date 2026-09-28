package com.connectx.settings.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(
    name = "user_devices",
    indexes = {
        @Index(name = "idx_user_devices_user_id", columnList = "user_id"),
        @Index(name = "idx_user_devices_active", columnList = "is_active")
    }
)
public class UserDevice {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "user_id", nullable = false)
    private UUID userId;

    @Column(name = "device_name", length = 120, nullable = false)
    private String deviceName;

    @Column(name = "device_type", length = 30)
    private String deviceType = "Desktop";

    @Column(name = "browser", length = 50)
    private String browser = "Chrome";

    @Column(name = "operating_system", length = 50)
    private String operatingSystem = "Windows 11";

    @Column(name = "ip_address", length = 60)
    private String ipAddress = "127.0.0.1 (Localhost)";

    @Column(name = "user_agent", columnDefinition = "TEXT")
    private String userAgent;

    @Column(name = "is_active", nullable = false)
    private boolean active = true;

    @Column(name = "is_current_session", nullable = false)
    private boolean currentSession = false;

    @Column(name = "last_active", nullable = false)
    private Instant lastActive;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    public UserDevice() {
    }

    public UserDevice(UUID userId, String deviceName, String deviceType, String browser, String operatingSystem, String ipAddress, String userAgent, boolean currentSession) {
        this.userId = userId;
        this.deviceName = deviceName;
        this.deviceType = deviceType;
        this.browser = browser;
        this.operatingSystem = operatingSystem;
        this.ipAddress = ipAddress;
        this.userAgent = userAgent;
        this.currentSession = currentSession;
        this.active = true;
        this.lastActive = Instant.now();
        this.createdAt = Instant.now();
    }

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (this.createdAt == null) {
            this.createdAt = now;
        }
        if (this.lastActive == null) {
            this.lastActive = now;
        }
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

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getDeviceType() {
        return deviceType;
    }

    public void setDeviceType(String deviceType) {
        this.deviceType = deviceType;
    }

    public String getBrowser() {
        return browser;
    }

    public void setBrowser(String browser) {
        this.browser = browser;
    }

    public String getOperatingSystem() {
        return operatingSystem;
    }

    public void setOperatingSystem(String operatingSystem) {
        this.operatingSystem = operatingSystem;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(boolean active) {
        this.active = active;
    }

    public boolean isCurrentSession() {
        return currentSession;
    }

    public void setCurrentSession(boolean currentSession) {
        this.currentSession = currentSession;
    }

    public Instant getLastActive() {
        return lastActive;
    }

    public void setLastActive(Instant lastActive) {
        this.lastActive = lastActive;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
