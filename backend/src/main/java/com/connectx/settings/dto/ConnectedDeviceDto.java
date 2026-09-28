package com.connectx.settings.dto;

import java.time.Instant;
import java.util.UUID;

public class ConnectedDeviceDto {

    private UUID id;
    private String deviceName;
    private String userAgent;
    private String ipAddress;
    private Instant createdAt;
    private Instant expiresAt;
    private boolean currentSession;

    public ConnectedDeviceDto() {
    }

    public ConnectedDeviceDto(UUID id, String deviceName, String userAgent, String ipAddress, Instant createdAt, Instant expiresAt, boolean currentSession) {
        this.id = id;
        this.deviceName = deviceName;
        this.userAgent = userAgent;
        this.ipAddress = ipAddress;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
        this.currentSession = currentSession;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getDeviceName() {
        return deviceName;
    }

    public void setDeviceName(String deviceName) {
        this.deviceName = deviceName;
    }

    public String getUserAgent() {
        return userAgent;
    }

    public void setUserAgent(String userAgent) {
        this.userAgent = userAgent;
    }

    public String getIpAddress() {
        return ipAddress;
    }

    public void setIpAddress(String ipAddress) {
        this.ipAddress = ipAddress;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(Instant expiresAt) {
        this.expiresAt = expiresAt;
    }

    public boolean isCurrentSession() {
        return currentSession;
    }

    public void setCurrentSession(boolean currentSession) {
        this.currentSession = currentSession;
    }
}
