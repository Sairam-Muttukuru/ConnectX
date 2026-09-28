package com.connectx.auth.service;

import com.connectx.auth.entity.PasswordResetToken;
import com.connectx.auth.repository.PasswordResetTokenRepository;
import com.connectx.exception.BadRequestException;
import com.connectx.exception.InvalidTokenException;
import com.connectx.exception.ResourceNotFoundException;
import com.connectx.security.SecurityAuditService;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

@Service
public class PasswordResetService {

    private static final Logger log = LoggerFactory.getLogger(PasswordResetService.class);
    private static final long RESET_EXPIRATION_MINUTES = 5;

    private final PasswordResetTokenRepository resetTokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final SecurityAuditService auditService;
    private final PasswordEncoder passwordEncoder;
    private final SecureRandom secureRandom = new SecureRandom();

    public PasswordResetService(
            PasswordResetTokenRepository resetTokenRepository,
            UserRepository userRepository,
            EmailService emailService,
            RefreshTokenService refreshTokenService,
            SecurityAuditService auditService,
            PasswordEncoder passwordEncoder) {
        this.resetTokenRepository = resetTokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
        this.auditService = auditService;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public void requestPasswordReset(String email) {
        if (email == null || email.trim().isEmpty()) {
            throw new BadRequestException("Email address is required");
        }
        String normalizedEmail = email.trim().toLowerCase();
        Optional<User> userOpt = userRepository.findByEmail(normalizedEmail);

        if (userOpt.isEmpty()) {
            log.info("Password reset requested for non-existent email: {}", normalizedEmail);
            throw new ResourceNotFoundException("No account found with this email address");
        }

        User user = userOpt.get();

        // Invalidate old active reset tokens
        resetTokenRepository.invalidateAllByUserId(user.getId(), Instant.now());

        // Generate secure 6-digit numeric OTP
        int otpNumber = 100_000 + secureRandom.nextInt(900_000);
        String rawOtp = String.valueOf(otpNumber);
        String tokenHash = TokenHashUtils.hashToken(rawOtp);

        // 5-minute expiration matching email template
        Instant expiresAt = Instant.now().plus(RESET_EXPIRATION_MINUTES, ChronoUnit.MINUTES);
        PasswordResetToken token = new PasswordResetToken(user.getId(), tokenHash, expiresAt);
        resetTokenRepository.save(token);

        emailService.sendPasswordResetEmail(user.getEmail(), user.getDisplayName(), user.getUsername(), rawOtp);
        auditService.logEvent(SecurityAuditService.SecurityEvent.PASSWORD_RESET_REQUESTED, user.getUsername(), "Password reset 6-digit OTP sent");
    }

    @Transactional
    public void resetPassword(String email, String rawCode, String newPassword, String confirmPassword) {
        if (rawCode == null || rawCode.trim().isEmpty()) {
            throw new InvalidTokenException("Reset OTP code is required");
        }

        if (!newPassword.equals(confirmPassword)) {
            throw new BadRequestException("New password and confirm password do not match");
        }

        String cleanCode = rawCode.trim();
        String codeHash = TokenHashUtils.hashToken(cleanCode);

        PasswordResetToken token = null;
        if (email != null && !email.trim().isEmpty()) {
            User user = userRepository.findByEmail(email.trim().toLowerCase()).orElse(null);
            if (user != null) {
                token = resetTokenRepository.findFirstByUserIdAndUsedAtIsNullOrderByCreatedAtDesc(user.getId())
                        .orElse(null);
            }
        }

        if (token == null) {
            token = resetTokenRepository.findByTokenHash(codeHash)
                    .orElseThrow(() -> new InvalidTokenException("Invalid password reset code"));
        } else {
            if (!token.getTokenHash().equals(codeHash)) {
                throw new InvalidTokenException("Invalid password reset code. Please check the code sent to your email.");
            }
        }

        if (token.isUsed()) {
            throw new InvalidTokenException("Password reset code has already been used");
        }

        if (token.isExpired()) {
            throw new InvalidTokenException("Password reset code has expired (valid for 5 minutes). Please request a new code.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for password reset"));

        // Update password hash
        user.setPasswordHash(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // Mark token used
        token.markUsed();
        resetTokenRepository.save(token);

        // Revoke all existing refresh sessions
        refreshTokenService.revokeAllUserTokens(user.getId());

        auditService.logEvent(SecurityAuditService.SecurityEvent.PASSWORD_CHANGED, user.getUsername(), "Password successfully changed and all sessions revoked");
        log.info("Password successfully reset with OTP for user: {}", user.getUsername());
    }

    @Transactional
    public void resetPassword(String rawToken, String newPassword, String confirmPassword) {
        resetPassword(null, rawToken, newPassword, confirmPassword);
    }
}
