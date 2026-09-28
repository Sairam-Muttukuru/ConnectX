package com.connectx.security;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;

@Service
public class SecurityAuditService {

    private static final Logger log = LoggerFactory.getLogger("SECURITY_AUDIT");

    public enum SecurityEvent {
        REGISTER,
        LOGIN_SUCCESS,
        LOGIN_FAILURE,
        EMAIL_VERIFIED,
        PASSWORD_RESET_REQUESTED,
        PASSWORD_CHANGED,
        LOGOUT,
        REFRESH_TOKEN_REVOKED
    }

    public void logEvent(SecurityEvent event, String identifier, String details) {
        log.info("[SECURITY AUDIT] Timestamp: {}, Event: {}, Identifier: {}, Details: {}",
                Instant.now(), event, identifier, details);
    }

    public void logEvent(SecurityEvent event, String identifier, Map<String, Object> metadata) {
        log.info("[SECURITY AUDIT] Timestamp: {}, Event: {}, Identifier: {}, Metadata: {}",
                Instant.now(), event, identifier, metadata);
    }
}
