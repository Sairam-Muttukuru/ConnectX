package com.connectx.auth.dto;

import com.connectx.user.entity.AccountStatus;

import java.util.UUID;

public class AuthUserResponse {

    private UUID id;
    private String username;
    private String displayName;
    private String email;
    private String avatarUrl;
    private boolean emailVerified;
    private AccountStatus accountStatus;

    public AuthUserResponse() {
    }

    public AuthUserResponse(UUID id, String username, String displayName, String email, boolean emailVerified, AccountStatus accountStatus) {
        this(id, username, displayName, email, null, emailVerified, accountStatus);
    }

    public AuthUserResponse(UUID id, String username, String displayName, String email, String avatarUrl, boolean emailVerified, AccountStatus accountStatus) {
        this.id = id;
        this.username = username;
        this.displayName = displayName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.emailVerified = emailVerified;
        this.accountStatus = accountStatus;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
