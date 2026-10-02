package com.connectx.auth;

import com.connectx.auth.entity.EmailVerificationToken;
import com.connectx.auth.entity.PasswordResetToken;
import com.connectx.auth.entity.RefreshToken;
import com.connectx.auth.repository.EmailVerificationTokenRepository;
import com.connectx.auth.repository.PasswordResetTokenRepository;
import com.connectx.auth.repository.RefreshTokenRepository;
import com.connectx.auth.service.*;
import com.connectx.exception.InvalidTokenException;
import com.connectx.security.SecurityAuditService;
import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TokenServicesTest {

    @Mock
    private EmailVerificationTokenRepository emailTokenRepo;

    @Mock
    private RefreshTokenRepository refreshTokenRepo;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepo;

    @Mock
    private UserRepository userRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private SecurityAuditService auditService;

    @Mock
    private PasswordEncoder passwordEncoder;

    private EmailVerificationService emailVerificationService;
    private RefreshTokenService refreshTokenService;
    private PasswordResetService passwordResetService;

    private User testUser;
    private UUID userId;

    @BeforeEach
    void setUp() {
        emailVerificationService = new EmailVerificationService(emailTokenRepo, userRepository, emailService, auditService);
        refreshTokenService = new RefreshTokenService(refreshTokenRepo, userRepository, auditService, 604800000);
        passwordResetService = new PasswordResetService(passwordResetTokenRepo, userRepository, emailService, refreshTokenService, auditService, passwordEncoder);

        userId = UUID.randomUUID();
        testUser = new User("sai_dev", "sai@gmail.com", "hash123", "Sai");
        testUser.setId(userId);
        testUser.setEmailVerified(false);
        testUser.setAccountStatus(AccountStatus.ACTIVE);
    }

    @Test
    void testVerifyEmail_Success() {
        String rawToken = "sample-token-123";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        EmailVerificationToken token = new EmailVerificationToken(userId, tokenHash, Instant.now().plus(1, ChronoUnit.HOURS));

        when(emailTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        emailVerificationService.verifyEmail(rawToken);

        assertTrue(testUser.isEmailVerified());
        assertTrue(token.isUsed());
        verify(userRepository).save(testUser);
        verify(emailTokenRepo).save(token);
    }

    @Test
    void testVerifyEmail_WithOtpAndEmail_Success() {
        String otp = "654321";
        String tokenHash = TokenHashUtils.hashToken(otp);
        EmailVerificationToken token = new EmailVerificationToken(userId, tokenHash, Instant.now().plus(1, ChronoUnit.HOURS));

        when(userRepository.findByIdentifier("sai@gmail.com")).thenReturn(Optional.of(testUser));
        when(emailTokenRepo.findFirstByUserIdAndUsedFalseOrderByCreatedAtDesc(userId)).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));

        emailVerificationService.verifyEmail("sai@gmail.com", otp);

        assertTrue(testUser.isEmailVerified());
        assertTrue(token.isUsed());
        verify(userRepository, atLeastOnce()).save(testUser);
        verify(emailTokenRepo).save(token);
    }

    @Test
    void testVerifyEmail_Expired() {
        String rawToken = "sample-token-expired";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        EmailVerificationToken token = new EmailVerificationToken(userId, tokenHash, Instant.now().minus(1, ChronoUnit.HOURS));

        when(emailTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(InvalidTokenException.class, () -> emailVerificationService.verifyEmail(rawToken));
    }

    @Test
    void testRefreshToken_RotationSuccess() {
        String rawToken = "valid-refresh-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        RefreshToken token = new RefreshToken(userId, tokenHash, Instant.now().plus(7, ChronoUnit.DAYS));

        when(refreshTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(refreshTokenRepo.save(any(RefreshToken.class))).thenAnswer(i -> i.getArgument(0));

        RefreshTokenService.RotationResult result = refreshTokenService.rotateRefreshToken(rawToken);

        assertNotNull(result);
        assertEquals(testUser, result.getUser());
        assertNotNull(result.getNewRawRefreshToken());
        assertNotEquals(rawToken, result.getNewRawRefreshToken());
        assertTrue(token.isRevoked());
    }

    @Test
    void testRefreshToken_RevokedAttempt() {
        String rawToken = "revoked-refresh-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        RefreshToken token = new RefreshToken(userId, tokenHash, Instant.now().plus(7, ChronoUnit.DAYS));
        token.revoke();

        when(refreshTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(InvalidTokenException.class, () -> refreshTokenService.rotateRefreshToken(rawToken));
    }

    @Test
    void testPasswordReset_Success() {
        String rawToken = "sample-reset-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        PasswordResetToken token = new PasswordResetToken(userId, tokenHash, Instant.now().plus(1, ChronoUnit.HOURS));

        when(passwordResetTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));
        when(userRepository.findById(userId)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode("NewPassword123")).thenReturn("newHash123");

        passwordResetService.resetPassword(rawToken, "NewPassword123", "NewPassword123");

        assertEquals("newHash123", testUser.getPasswordHash());
        assertTrue(token.isUsed());
        verify(userRepository).save(testUser);
        verify(refreshTokenRepo).revokeAllByUserId(eq(userId), any(Instant.class));
    }

    @Test
    void testPasswordReset_Expired() {
        String rawToken = "expired-reset-token";
        String tokenHash = TokenHashUtils.hashToken(rawToken);
        PasswordResetToken token = new PasswordResetToken(userId, tokenHash, Instant.now().minus(1, ChronoUnit.HOURS));

        when(passwordResetTokenRepo.findByTokenHash(tokenHash)).thenReturn(Optional.of(token));

        assertThrows(InvalidTokenException.class, () ->
                passwordResetService.resetPassword(rawToken, "NewPassword123", "NewPassword123"));
    }
}
