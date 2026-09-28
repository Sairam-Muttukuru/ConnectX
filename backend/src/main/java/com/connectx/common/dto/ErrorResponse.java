package com.connectx.common.dto;

import java.time.LocalDateTime;
import java.util.List;

public class ErrorResponse {

    private boolean success;
    private int status;
    private String code;
    private String message;
    private List<String> details;
    private LocalDateTime timestamp;

    public ErrorResponse() {
        this.timestamp = LocalDateTime.now();
    }

    public ErrorResponse(boolean success, int status, String code, String message, List<String> details) {
        this.success = success;
        this.status = status;
        this.code = code;
        this.message = message;
        this.details = details;
        this.timestamp = LocalDateTime.now();
    }

    public static ErrorResponse of(int status, String code, String message) {
        return new ErrorResponse(false, status, code, message, null);
    }

    public static ErrorResponse of(int status, String code, String message, List<String> details) {
        return new ErrorResponse(false, status, code, message, details);
    }

    public boolean isSuccess() {
        return success;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public int getStatus() {
        return status;
    }

    public void setStatus(int status) {
        this.status = status;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getDetails() {
        return details;
    }

    public void setDetails(List<String> details) {
        this.details = details;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
