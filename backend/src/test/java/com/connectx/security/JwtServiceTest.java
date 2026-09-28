package com.connectx.security;

import com.connectx.user.entity.AccountStatus;
import com.connectx.user.entity.User;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private JwtService jwtService;
    private User testUser;

    @BeforeEach
    void setUp() {
        String secret = "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970";
        long expirationMs = 900000; // 15 mins
        jwtService = new JwtService(secret, expirationMs);

        testUser = new User("sai_dev", "sai@gmail.com", "hashed_pwd", "Sai");
        testUser.setId(UUID.randomUUID());
        testUser.setEmailVerified(true);
        testUser.setAccountStatus(AccountStatus.ACTIVE);
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = jwtService.generateAccessToken(testUser);
        assertNotNull(token);
        assertTrue(jwtService.validateToken(token));

        UUID extractedId = jwtService.extractUserId(token);
        assertEquals(testUser.getId(), extractedId);
    }

    @Test
    void testInvalidTokenSignature() {
        String invalidToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIn0.doNotMatch";
        assertFalse(jwtService.validateToken(invalidToken));
    }

    @Test
    void testExpiredTokenValidation() {
        // JwtService with 0ms expiration
        JwtService expiredService = new JwtService("404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970", -1000);
        String expiredToken = expiredService.generateAccessToken(testUser);
        assertFalse(jwtService.validateToken(expiredToken));
    }
}
