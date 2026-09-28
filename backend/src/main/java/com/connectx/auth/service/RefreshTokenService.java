package com.connectx.auth.service;

import com.connectx.auth.entity.RefreshToken;
import com.connectx.auth.repository.RefreshTokenRepository;
import com.connectx.exception.InvalidTokenException;
import com.connectx.security.SecurityAuditService;
import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RefreshTokenService {

    private static final Logger log = LoggerFactory.getLogger(RefreshTokenService.class);

    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final SecurityAuditService auditService;
    private final long refreshTokenExpirationDays;

    public static class RotationResult {
        private final User user;
        private final String newRawRefreshToken;

        public RotationResult(User user, String newRawRefreshToken) {
            this.user = user;
            this.newRawRefreshToken = newRawRefreshToken;
        }

        public User getUser() {
            return user;
        }

        public String getNewRawRefreshToken() {
            return newRawRefreshToken;
        }
    }

    public RefreshTokenService(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            SecurityAuditService auditService,
            @Value("${connectx.jwt.refresh-token-expiration:${app.jwt.refresh-token-expiration-ms:${jwt.refresh-expiration:604800000}}}") long refreshTokenExpirationMs) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.auditService = auditService;
        this.refreshTokenExpirationDays = Math.max(1, refreshTokenExpirationMs / (1000 * 60 * 60 * 24));
    }

    @Transactional
    public String createRefreshToken(User user, String deviceName, String userAgent, String ipAddress) {
        String rawToken = UUID.randomUUID().toString().replace("-", "") + UUID.randomUUID().toString().replace("-", "");
        String tokenHash = TokenHashUtils.hashToken(rawToken);

        Instant expiresAt = Instant.now().plus(refreshTokenExpirationDays, ChronoUnit.DAYS);
        RefreshToken token = new RefreshToken(user.getId(), tokenHash, expiresAt);
        token.setDeviceName(deviceName);
        token.setUserAgent(userAgent);
        token.setIpAddress(ipAddress);

        refreshTokenRepository.save(token);
        return rawToken;
    }

    @Transactional
    public RotationResult rotateRefreshToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.trim().isEmpty()) {
            throw new InvalidTokenException("Refresh token is required");
        }

        String tokenHash = TokenHashUtils.hashToken(rawRefreshToken.trim());
        RefreshToken token = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidTokenException("Invalid refresh token"));

        if (token.isRevoked()) {
            auditService.logEvent(SecurityAuditService.SecurityEvent.REFRESH_TOKEN_REVOKED, token.getUserId().toString(), "Attempt to use already revoked refresh token");
            throw new InvalidTokenException("Refresh token has been revoked");
        }

        if (token.isExpired()) {
            throw new InvalidTokenException("Refresh token has expired");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new InvalidTokenException("User not found for refresh token"));

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            throw new InvalidTokenException("Account is not active: " + user.getAccountStatus());
        }

        // Revoke the old token (rotation)
        token.revoke();
        refreshTokenRepository.save(token);

        // Generate and issue new rotated refresh token
        String newRawToken = createRefreshToken(user, token.getDeviceName(), token.getUserAgent(), token.getIpAddress());

        log.debug("Successfully rotated refresh token for user: {}", user.getUsername());
        return new RotationResult(user, newRawToken);
    }

    @Transactional
    public void revokeToken(String rawRefreshToken) {
        if (rawRefreshToken == null || rawRefreshToken.trim().isEmpty()) {
            return;
        }
        String tokenHash = TokenHashUtils.hashToken(rawRefreshToken.trim());
        refreshTokenRepository.findByTokenHash(tokenHash).ifPresent(token -> {
            token.revoke();
            refreshTokenRepository.save(token);
            auditService.logEvent(SecurityAuditService.SecurityEvent.LOGOUT, token.getUserId().toString(), "Refresh token revoked via logout");
        });
    }

    @Transactional
    public void revokeAllUserTokens(UUID userId) {
        refreshTokenRepository.revokeAllByUserId(userId, Instant.now());
        auditService.logEvent(SecurityAuditService.SecurityEvent.REFRESH_TOKEN_REVOKED, userId.toString(), "All sessions revoked for user");
        log.info("Revoked all active refresh sessions for userId: {}", userId);
    }
}
