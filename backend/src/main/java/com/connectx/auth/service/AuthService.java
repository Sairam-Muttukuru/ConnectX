package com.connectx.auth.service;

import com.connectx.auth.dto.*;
import com.connectx.auth.mapper.AuthMapper;
import com.connectx.exception.*;
import com.connectx.security.JwtService;
import com.connectx.security.SecurityAuditService;
import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;
import com.connectx.user.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.regex.Pattern;

@Service
public class AuthService {

    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    private static final Pattern USERNAME_PATTERN = Pattern.compile("^[a-z0-9_]{3,30}$");

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final EmailVerificationService emailVerificationService;
    private final RefreshTokenService refreshTokenService;
    private final PasswordResetService passwordResetService;
    private final AuthMapper authMapper;
    private final SecurityAuditService auditService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            EmailVerificationService emailVerificationService,
            RefreshTokenService refreshTokenService,
            PasswordResetService passwordResetService,
            AuthMapper authMapper,
            SecurityAuditService auditService) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.emailVerificationService = emailVerificationService;
        this.refreshTokenService = refreshTokenService;
        this.passwordResetService = passwordResetService;
        this.authMapper = authMapper;
        this.auditService = auditService;
    }

    @Transactional
    public void register(RegisterRequest request) {
        if (!request.getPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("Password and password confirmation do not match");
        }

        String normalizedUsername = request.getUsername().trim().toLowerCase();
        String normalizedEmail = request.getEmail().trim().toLowerCase();

        if (!USERNAME_PATTERN.matcher(normalizedUsername).matches()) {
            throw new BadRequestException("Username must be 3-30 characters and contain only lowercase letters, numbers, and underscores");
        }

        if (userRepository.existsByUsername(normalizedUsername)) {
            throw new DuplicateResourceException("Username already exists");
        }

        if (userRepository.existsByEmail(normalizedEmail)) {
            throw new DuplicateResourceException("Email already exists");
        }

        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(normalizedUsername, normalizedEmail, passwordHash, normalizedUsername);
        user.setEmailVerified(false);
        user.setAccountStatus(AccountStatus.ACTIVE);
        if (request.getAvatarUrl() != null && !request.getAvatarUrl().trim().isEmpty()) {
            user.setAvatarUrl(request.getAvatarUrl().trim());
        }

        User savedUser = userRepository.save(user);

        // Generate verification token and send email
        emailVerificationService.createAndSendVerificationToken(savedUser);

        auditService.logEvent(SecurityAuditService.SecurityEvent.REGISTER, normalizedUsername, "User registered successfully");
        log.info("New user registered: {} ({})", normalizedUsername, savedUser.getId());
    }

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        String rawIdentifier = request.getIdentifier().trim().toLowerCase();
        String cleanIdentifier = rawIdentifier.startsWith("@") ? rawIdentifier.substring(1) : rawIdentifier;

        User user = userRepository.findByIdentifier(rawIdentifier)
                .or(() -> userRepository.findByIdentifier(cleanIdentifier))
                .orElseThrow(() -> {
                    auditService.logEvent(SecurityAuditService.SecurityEvent.LOGIN_FAILURE, rawIdentifier, "Non-existent user identifier");
                    return new InvalidCredentialsException("Invalid username or password");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditService.logEvent(SecurityAuditService.SecurityEvent.LOGIN_FAILURE, user.getUsername(), "Incorrect password");
            throw new InvalidCredentialsException("Invalid username or password");
        }

        if (user.getAccountStatus() != AccountStatus.ACTIVE) {
            auditService.logEvent(SecurityAuditService.SecurityEvent.LOGIN_FAILURE, user.getUsername(), "Inactive account status: " + user.getAccountStatus());
            throw new InvalidCredentialsException("Account is currently " + user.getAccountStatus().name().toLowerCase());
        }

        if (!user.isEmailVerified()) {
            auditService.logEvent(SecurityAuditService.SecurityEvent.LOGIN_FAILURE, user.getUsername(), "Unverified email login attempt");
            throw new EmailNotVerifiedException("Email is not verified. Please verify your email before logging in.");
        }

        String accessToken = jwtService.generateAccessToken(user);

        String userAgent = httpRequest != null ? httpRequest.getHeader("User-Agent") : "Unknown";
        String ipAddress = httpRequest != null ? httpRequest.getRemoteAddr() : "Unknown";
        String refreshToken = refreshTokenService.createRefreshToken(user, "Web Browser", userAgent, ipAddress);

        auditService.logEvent(SecurityAuditService.SecurityEvent.LOGIN_SUCCESS, user.getUsername(), "User logged in successfully");

        return new LoginResponse(
                accessToken,
                refreshToken,
                jwtService.getAccessTokenExpirationSeconds(),
                authMapper.toAuthUserResponse(user)
        );
    }

    @Transactional
    public void verifyEmail(VerifyEmailRequest request) {
        String code = request.getEffectiveToken();
        if (code == null || code.trim().isEmpty()) {
            throw new InvalidTokenException("Verification OTP is required");
        }
        emailVerificationService.verifyEmail(request.getEmail(), code);
    }

    @Transactional
    public String resendVerification(ResendVerificationRequest request) {
        String rawIdentifier = request.getEmail().trim().toLowerCase();
        String cleanIdentifier = rawIdentifier.startsWith("@") ? rawIdentifier.substring(1) : rawIdentifier;

        User user = userRepository.findByIdentifier(rawIdentifier)
                .or(() -> userRepository.findByIdentifier(cleanIdentifier))
                .orElseThrow(() -> new ResourceNotFoundException("No account found with this email or username"));

        if (user.isEmailVerified()) {
            throw new BadRequestException("This account is already verified");
        }

        emailVerificationService.createAndSendVerificationToken(user);
        return user.getEmail();
    }

    @Transactional
    public RefreshTokenResponse refresh(RefreshTokenRequest request) {
        RefreshTokenService.RotationResult result = refreshTokenService.rotateRefreshToken(request.getRefreshToken());
        String newAccessToken = jwtService.generateAccessToken(result.getUser());

        return new RefreshTokenResponse(
                newAccessToken,
                result.getNewRawRefreshToken(),
                jwtService.getAccessTokenExpirationSeconds()
        );
    }

    @Transactional
    public void logout(RefreshTokenRequest request) {
        refreshTokenService.revokeToken(request.getRefreshToken());
    }

    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        passwordResetService.requestPasswordReset(request.getEmail());
    }

    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        passwordResetService.resetPassword(request.getEmail(), request.getToken(), request.getNewPassword(), request.getConfirmPassword());
    }

    @Transactional(readOnly = true)
    public AuthUserResponse getCurrentUser(java.util.UUID userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return authMapper.toAuthUserResponse(user);
    }
}
