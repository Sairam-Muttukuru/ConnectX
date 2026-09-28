package com.connectx.auth.service;

import com.connectx.auth.entity.EmailVerificationToken;
import com.connectx.auth.repository.EmailVerificationTokenRepository;
import com.connectx.exception.InvalidTokenException;
import com.connectx.exception.ResourceNotFoundException;
import com.connectx.security.SecurityAuditService;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class EmailVerificationService {

    private static final Logger log = LoggerFactory.getLogger(EmailVerificationService.class);
    private static final long VERIFICATION_EXPIRATION_MINUTES = 5;

    private final EmailVerificationTokenRepository tokenRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;
    private final SecurityAuditService auditService;
    private final SecureRandom secureRandom = new SecureRandom();

    public EmailVerificationService(
            EmailVerificationTokenRepository tokenRepository,
            UserRepository userRepository,
            EmailService emailService,
            SecurityAuditService auditService) {
        this.tokenRepository = tokenRepository;
        this.userRepository = userRepository;
        this.emailService = emailService;
        this.auditService = auditService;
    }

    @Transactional
    public String createAndSendVerificationToken(User user) {
        // Invalidate previous unused tokens for this user
        tokenRepository.invalidateAllByUserId(user.getId());

        // Generate a 6-digit secure numeric OTP
        int otpNumber = 100_000 + secureRandom.nextInt(900_000);
        String rawOtp = String.valueOf(otpNumber);
        String tokenHash = TokenHashUtils.hashToken(rawOtp);

        Instant expiresAt = Instant.now().plus(VERIFICATION_EXPIRATION_MINUTES, ChronoUnit.MINUTES);
        EmailVerificationToken token = new EmailVerificationToken(user.getId(), tokenHash, expiresAt);
        tokenRepository.save(token);

        emailService.sendVerificationEmail(user.getEmail(), user.getDisplayName(), rawOtp);
        return rawOtp;
    }

    @Transactional
    public void verifyEmail(String email, String rawCode) {
        if (rawCode == null || rawCode.trim().isEmpty()) {
            throw new InvalidTokenException("Verification OTP or token is required");
        }

        String cleanCode = rawCode.trim();
        String codeHash = TokenHashUtils.hashToken(cleanCode);

        EmailVerificationToken token = null;
        if (email != null && !email.trim().isEmpty()) {
            String raw = email.trim().toLowerCase();
            String clean = raw.startsWith("@") ? raw.substring(1) : raw;
            User user = userRepository.findByIdentifier(raw)
                    .or(() -> userRepository.findByIdentifier(clean))
                    .orElse(null);
            if (user != null) {
                token = tokenRepository.findFirstByUserIdAndUsedFalseOrderByCreatedAtDesc(user.getId())
                        .orElse(null);
            }
        }

        if (token == null) {
            token = tokenRepository.findByTokenHash(codeHash)
                    .orElseThrow(() -> new InvalidTokenException("Invalid verification OTP"));
        } else {
            if (!token.getTokenHash().equals(codeHash)) {
                throw new InvalidTokenException("Invalid verification OTP. Please check the code sent to your email.");
            }
        }

        if (token.isUsed()) {
            throw new InvalidTokenException("Verification OTP has already been used");
        }

        if (token.isExpired()) {
            throw new InvalidTokenException("Verification OTP has expired. Please request a new code.");
        }

        User user = userRepository.findById(token.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found for this verification code"));

        user.setEmailVerified(true);
        userRepository.save(user);

        token.setUsed(true);
        tokenRepository.save(token);

        auditService.logEvent(SecurityAuditService.SecurityEvent.EMAIL_VERIFIED, user.getUsername(), "Email verified successfully");
        log.info("User {} ({}) successfully verified email address with OTP", user.getUsername(), user.getId());
    }

    @Transactional
    public void verifyEmail(String rawToken) {
        verifyEmail(null, rawToken);
    }
}
