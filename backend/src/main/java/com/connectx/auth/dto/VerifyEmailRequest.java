package com.connectx.auth.dto;

public class VerifyEmailRequest {

    private String token;
    private String otp;
    private String email;

    public VerifyEmailRequest() {
    }

    public VerifyEmailRequest(String token) {
        this.token = token;
    }

    public VerifyEmailRequest(String email, String otp) {
        this.email = email;
        this.otp = otp;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getOtp() {
        return otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getEffectiveToken() {
        if (otp != null && !otp.trim().isEmpty()) {
            return otp.trim();
        }
        return token != null ? token.trim() : "";
    }
}
