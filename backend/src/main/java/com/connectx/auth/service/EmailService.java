package com.connectx.auth.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ClassPathResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.util.StreamUtils;

import java.io.InputStream;
import java.nio.charset.StandardCharsets;

@Service
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    private final JavaMailSender mailSender;
    private final String frontendUrl;
    private final String fromEmail;

    public EmailService(
            JavaMailSender mailSender,
            @Value("${connectx.frontend-url:http://localhost:5173}") String frontendUrl,
            @Value("${spring.mail.username:no-reply@connectx.app}") String fromEmail) {
        this.mailSender = mailSender;
        this.frontendUrl = frontendUrl;
        this.fromEmail = fromEmail;
    }

    public void sendVerificationEmail(String toEmail, String displayName, String rawOtp) {
        String verificationLink = frontendUrl + "/#verify-email?otp=" + rawOtp + "&email=" + toEmail;
        log.info("================================================================================");
        log.info("[EMAIL NOTIFICATION] >>> CONNECTX VERIFICATION OTP FOR {}: [{}] <<<", toEmail, rawOtp);
        log.info("[EMAIL NOTIFICATION] One-click activation link: {}", verificationLink);
        log.info("================================================================================");

        try {
            String template = loadTemplate("templates/email/verification-email.html");
            String otpStr = (rawOtp != null && rawOtp.trim().length() >= 6) ? rawOtp.trim() : "000000";
            String htmlContent = template
                    .replace("{{displayName}}", displayName != null ? displayName : "ConnectX User")
                    .replace("{{otp}}", rawOtp)
                    .replace("{{otp_0}}", String.valueOf(otpStr.charAt(0)))
                    .replace("{{otp_1}}", String.valueOf(otpStr.charAt(1)))
                    .replace("{{otp_2}}", String.valueOf(otpStr.charAt(2)))
                    .replace("{{otp_3}}", String.valueOf(otpStr.charAt(3)))
                    .replace("{{otp_4}}", String.valueOf(otpStr.charAt(4)))
                    .replace("{{otp_5}}", String.valueOf(otpStr.charAt(5)))
                    .replace("{{verificationLink}}", verificationLink);

            sendMimeMessage(toEmail, "Your ConnectX Verification Code: " + rawOtp, htmlContent);
            log.info("[EMAIL NOTIFICATION] Verification email dispatched successfully to {}", toEmail);
        } catch (Exception e) {
            log.error("[EMAIL NOTIFICATION] SMTP dispatch failed for {} ({}). Active OTP code: {}", toEmail, e.getMessage(), rawOtp, e);
        }
    }

    public void sendPasswordResetEmail(String toEmail, String displayName, String username, String rawOtp) {
        String otpStr = (rawOtp != null && rawOtp.trim().length() >= 6) ? rawOtp.trim() : "000000";
        String resetLink = frontendUrl + "/#reset-password?otp=" + otpStr + "&email=" + toEmail;
        log.info("================================================================================");
        log.info("[EMAIL NOTIFICATION] >>> CONNECTX PASSWORD RESET OTP FOR {}: [{}] <<<", toEmail, otpStr);
        log.info("[EMAIL NOTIFICATION] Password reset link: {}", resetLink);
        log.info("================================================================================");

        try {
            String template = loadTemplate("templates/email/password-reset-email.html");
            String htmlContent = template
                    .replace("{{displayName}}", displayName != null ? displayName : "ConnectX User")
                    .replace("{{username}}", username != null ? username : "")
                    .replace("{{otp}}", otpStr)
                    .replace("{{otp_0}}", String.valueOf(otpStr.charAt(0)))
                    .replace("{{otp_1}}", String.valueOf(otpStr.charAt(1)))
                    .replace("{{otp_2}}", String.valueOf(otpStr.charAt(2)))
                    .replace("{{otp_3}}", String.valueOf(otpStr.charAt(3)))
                    .replace("{{otp_4}}", String.valueOf(otpStr.charAt(4)))
                    .replace("{{otp_5}}", String.valueOf(otpStr.charAt(5)))
                    .replace("{{resetLink}}", resetLink);

            sendMimeMessage(toEmail, "Your ConnectX Password Reset Code: " + otpStr, htmlContent);
            log.info("[EMAIL NOTIFICATION] Password reset email dispatched successfully to {}", toEmail);
        } catch (Exception e) {
            log.warn("[EMAIL NOTIFICATION] SMTP dispatch failed ({}); active reset OTP code: {}", e.getMessage(), otpStr);
        }
    }

    private void sendMimeMessage(String to, String subject, String htmlContent) throws Exception {
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
        helper.setFrom(fromEmail, "ConnectX");
        helper.setTo(to);
        helper.setSubject(subject);
        helper.setText(htmlContent, true);
        mailSender.send(message);
    }

    private String loadTemplate(String path) {
        try {
            ClassPathResource resource = new ClassPathResource(path);
            try (InputStream inputStream = resource.getInputStream()) {
                return StreamUtils.copyToString(inputStream, StandardCharsets.UTF_8);
            }
        } catch (Exception e) {
            log.warn("Failed to load email template: {}. Falling back to basic text.", path);
            return "<p>Hello {{displayName}}, please visit: <a href=\"{{verificationLink}}{{resetLink}}\">Click here</a></p>";
        }
    }
}
