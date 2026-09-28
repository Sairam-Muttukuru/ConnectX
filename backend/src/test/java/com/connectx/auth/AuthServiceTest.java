package com.connectx.auth;

import com.connectx.auth.dto.LoginRequest;
import com.connectx.auth.dto.LoginResponse;
import com.connectx.auth.dto.RegisterRequest;
import com.connectx.auth.mapper.AuthMapper;
import com.connectx.auth.service.*;
import com.connectx.exception.BadRequestException;
import com.connectx.exception.DuplicateResourceException;
import com.connectx.exception.EmailNotVerifiedException;
import com.connectx.exception.InvalidCredentialsException;
import com.connectx.security.JwtService;
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

import java.util.Optional;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private EmailVerificationService emailVerificationService;

    @Mock
    private RefreshTokenService refreshTokenService;

    @Mock
    private PasswordResetService passwordResetService;

    @Mock
    private SecurityAuditService auditService;

    private final AuthMapper authMapper = new AuthMapper();

    private AuthService authService;

    @BeforeEach
    void setUp() {
        authService = new AuthService(
                userRepository,
                passwordEncoder,
                jwtService,
                emailVerificationService,
                refreshTokenService,
                passwordResetService,
                authMapper,
                auditService
        );
    }

    @Test
    void testRegister_Success() {
        RegisterRequest request = new RegisterRequest("sai_dev", "sai@gmail.com", "Password123", "Password123");

        when(userRepository.existsByUsername("sai_dev")).thenReturn(false);
        when(userRepository.existsByEmail("sai@gmail.com")).thenReturn(false);
        when(passwordEncoder.encode("Password123")).thenReturn("encoded_hash");
        when(userRepository.save(any(User.class))).thenAnswer(i -> {
            User u = i.getArgument(0);
            u.setId(UUID.randomUUID());
            return u;
        });

        assertDoesNotThrow(() -> authService.register(request));
        verify(emailVerificationService).createAndSendVerificationToken(any(User.class));
    }

    @Test
    void testRegister_PasswordMismatch() {
        RegisterRequest request = new RegisterRequest("sai_dev", "sai@gmail.com", "Password123", "Mismatch123");
        assertThrows(BadRequestException.class, () -> authService.register(request));
    }

    @Test
    void testRegister_DuplicateUsername() {
        RegisterRequest request = new RegisterRequest("sai_dev", "sai@gmail.com", "Password123", "Password123");
        when(userRepository.existsByUsername("sai_dev")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void testRegister_DuplicateEmail() {
        RegisterRequest request = new RegisterRequest("sai_dev", "sai@gmail.com", "Password123", "Password123");
        when(userRepository.existsByUsername("sai_dev")).thenReturn(false);
        when(userRepository.existsByEmail("sai@gmail.com")).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void testLogin_Success() {
        User user = new User("sai_dev", "sai@gmail.com", "encoded_hash", "Sai");
        user.setId(UUID.randomUUID());
        user.setEmailVerified(true);
        user.setAccountStatus(AccountStatus.ACTIVE);

        LoginRequest request = new LoginRequest("sai_dev", "Password123");

        when(userRepository.findByIdentifier("sai_dev")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123", "encoded_hash")).thenReturn(true);
        when(jwtService.generateAccessToken(user)).thenReturn("mock_jwt");
        when(refreshTokenService.createRefreshToken(eq(user), any(), any(), any())).thenReturn("mock_refresh");
        when(jwtService.getAccessTokenExpirationSeconds()).thenReturn(900L);

        LoginResponse response = authService.login(request, null);

        assertNotNull(response);
        assertEquals("mock_jwt", response.getAccessToken());
        assertEquals("mock_refresh", response.getRefreshToken());
        assertEquals("sai_dev", response.getUser().getUsername());
    }

    @Test
    void testLogin_WrongPassword() {
        User user = new User("sai_dev", "sai@gmail.com", "encoded_hash", "Sai");
        user.setId(UUID.randomUUID());
        user.setEmailVerified(true);

        LoginRequest request = new LoginRequest("sai_dev", "WrongPassword123");

        when(userRepository.findByIdentifier("sai_dev")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("WrongPassword123", "encoded_hash")).thenReturn(false);

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request, null));
    }

    @Test
    void testLogin_UnverifiedEmail() {
        User user = new User("sai_dev", "sai@gmail.com", "encoded_hash", "Sai");
        user.setId(UUID.randomUUID());
        user.setEmailVerified(false); // not verified
        user.setAccountStatus(AccountStatus.ACTIVE);

        LoginRequest request = new LoginRequest("sai_dev", "Password123");

        when(userRepository.findByIdentifier("sai_dev")).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("Password123", "encoded_hash")).thenReturn(true);

        assertThrows(EmailNotVerifiedException.class, () -> authService.login(request, null));
    }
}
