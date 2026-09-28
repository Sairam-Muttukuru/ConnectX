package com.connectx.auth;

import com.connectx.auth.controller.AuthController;
import com.connectx.auth.dto.*;
import com.connectx.auth.service.AuthService;
import com.connectx.exception.GlobalExceptionHandler;
import com.connectx.security.CustomUserPrincipal;
import com.connectx.security.RateLimiterService;
import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    private MockMvc mockMvc;
    private final ObjectMapper objectMapper = new ObjectMapper();

    @Mock
    private AuthService authService;

    @Mock
    private RateLimiterService rateLimiterService;

    @InjectMocks
    private AuthController authController;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(authController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
    }

    @Test
    void testRegister_Success() throws Exception {
        RegisterRequest request = new RegisterRequest("sai_dev", "sai@gmail.com", "StrongPassword123", "StrongPassword123");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Registration successful. Please verify your email."));

        verify(authService).register(any(RegisterRequest.class));
    }

    @Test
    void testRegister_InvalidPayload_BadRequest() throws Exception {
        RegisterRequest invalid = new RegisterRequest("", "not-an-email", "short", "short");

        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(invalid)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.success").value(false))
                .andExpect(jsonPath("$.code").value("VALIDATION_FAILED"));
    }

    @Test
    void testLogin_Success() throws Exception {
        LoginRequest request = new LoginRequest("sai_dev", "StrongPassword123");
        AuthUserResponse user = new AuthUserResponse(UUID.randomUUID(), "sai_dev", "Sai", "sai@gmail.com", true, AccountStatus.ACTIVE);
        LoginResponse response = new LoginResponse("access.token.jwt", "refresh.token.uuid", 900, user);

        when(authService.login(any(LoginRequest.class), any())).thenReturn(response);

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("access.token.jwt"))
                .andExpect(jsonPath("$.data.refreshToken").value("refresh.token.uuid"))
                .andExpect(jsonPath("$.data.user.username").value("sai_dev"));
    }

    @Test
    void testVerifyEmail_Success() throws Exception {
        VerifyEmailRequest request = new VerifyEmailRequest("valid-token");

        mockMvc.perform(post("/api/auth/verify-email")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        verify(authService).verifyEmail(any(VerifyEmailRequest.class));
    }

    @Test
    void testRefreshToken_Success() throws Exception {
        RefreshTokenRequest request = new RefreshTokenRequest("valid-refresh-token");
        RefreshTokenResponse response = new RefreshTokenResponse("new.access.token", "new.refresh.token", 900);

        when(authService.refresh(any(RefreshTokenRequest.class))).thenReturn(response);

        mockMvc.perform(post("/api/auth/refresh")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.data.accessToken").value("new.access.token"));
    }

    @Test
    void testForgotPassword_Success() throws Exception {
        ForgotPasswordRequest request = new ForgotPasswordRequest("sai@gmail.com");

        mockMvc.perform(post("/api/auth/forgot-password")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true))
                .andExpect(jsonPath("$.message").value("Password reset verification code has been sent to your email."));

        verify(authService).forgotPassword(any(ForgotPasswordRequest.class));
    }
}
