package com.connectx.message.websocket;

import com.connectx.security.JwtService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.server.ServerHttpRequest;
import org.springframework.http.server.ServerHttpResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.WebSocketHandler;
import org.springframework.web.socket.server.HandshakeInterceptor;

import java.net.URI;
import java.util.Map;
import java.util.UUID;

@Component
public class WebSocketAuthInterceptor implements HandshakeInterceptor {

    private static final Logger log = LoggerFactory.getLogger(WebSocketAuthInterceptor.class);

    private final JwtService jwtService;

    public WebSocketAuthInterceptor(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Override
    public boolean beforeHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Map<String, Object> attributes) {

        String token = null;

        // 1. Try extracting token from query param: ?token=...
        URI uri = request.getURI();
        if (uri.getQuery() != null) {
            for (String param : uri.getQuery().split("&")) {
                String[] pair = param.split("=", 2);
                if (pair.length == 2 && "token".equalsIgnoreCase(pair[0])) {
                    token = pair[1];
                    break;
                }
            }
        }

        // 2. Try extracting from Authorization header
        if (token == null || token.isBlank()) {
            String authHeader = request.getHeaders().getFirst("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                token = authHeader.substring(7);
            }
        }

        if (token != null && !token.isBlank() && jwtService.validateToken(token)) {
            try {
                UUID userId = jwtService.extractUserId(token);
                attributes.put("userId", userId);
                log.info("WebSocket handshake authenticated for user ID: {}", userId);
                return true;
            } catch (Exception e) {
                log.warn("Failed to extract user ID from valid token during WS handshake: {}", e.getMessage());
            }
        }

        log.warn("Unauthorized WebSocket handshake attempt rejected from: {}", request.getRemoteAddress());
        response.setStatusCode(HttpStatus.UNAUTHORIZED);
        return false;
    }

    @Override
    public void afterHandshake(
            ServerHttpRequest request,
            ServerHttpResponse response,
            WebSocketHandler wsHandler,
            Exception exception) {
    }
}
