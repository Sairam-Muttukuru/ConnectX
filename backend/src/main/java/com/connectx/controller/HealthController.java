package com.connectx.controller;

import com.connectx.common.dto.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.sql.DataSource;
import java.sql.Connection;
import java.time.LocalDateTime;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger log = LoggerFactory.getLogger(HealthController.class);

    private final DataSource dataSource;

    public HealthController(DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<Map<String, Object>>> getHealth() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("status", "UP");
        data.put("app", "ConnectX Backend");
        data.put("version", "1.0.0");
        data.put("timestamp", LocalDateTime.now());

        // Check database connectivity
        boolean dbConnected = false;
        String dbError = null;
        try (Connection conn = dataSource.getConnection()) {
            dbConnected = conn.isValid(2);
            data.put("databaseProduct", conn.getMetaData().getDatabaseProductName());
            data.put("databaseVersion", conn.getMetaData().getDatabaseProductVersion());
        } catch (Exception e) {
            log.warn("Database connectivity check failed: {}", e.getMessage());
            dbError = e.getMessage();
        }

        data.put("database", dbConnected ? "UP" : "DOWN");
        if (dbError != null) {
            data.put("databaseError", dbError);
        }

        return ResponseEntity.ok(ApiResponse.success("ConnectX Backend is operational", data));
    }

    @GetMapping("/ping")
    public ResponseEntity<ApiResponse<String>> ping() {
        return ResponseEntity.ok(ApiResponse.success("pong"));
    }
}
