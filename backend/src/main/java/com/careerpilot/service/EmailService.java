package com.careerpilot.service;

import jakarta.mail.internet.MimeMessage;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@Slf4j
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Value("${app.mail.from:noreply@careerpilot.ai}")
    private String fromEmail;

    @Value("${app.frontend-url:http://localhost:3000}")
    private String frontendUrl;

    @Async
    public void sendVerificationEmail(String toEmail, String fullName, String token) {
        String verificationUrl = frontendUrl + "/verify-email?token=" + token;
        String subject = "CareerPilot — Verify your email address";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
              <h2 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">Welcome to CareerPilot, %s!</h2>
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.5;">Please confirm your email address by clicking the button below to complete your registration and activate your AI Career OS dashboard.</p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="%s" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Verify Email Address</a>
              </div>
              <p style="color: #94a3b8; font-size: 14px;">If the button does not work, copy and paste this link into your browser:</p>
              <p style="color: #818cf8; word-break: break-all; font-size: 13px;">%s</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
              <p style="color: #64748b; font-size: 12px;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
            </div>
            """.formatted(fullName, verificationUrl, verificationUrl);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Async
    public void sendPasswordResetEmail(String toEmail, String fullName, String token) {
        String resetUrl = frontendUrl + "/reset-password?token=" + token;
        String subject = "CareerPilot — Reset your password";
        String htmlContent = """
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0f172a; color: #f8fafc; padding: 24px; border-radius: 12px; border: 1px solid #1e293b;">
              <h2 style="color: #6366f1; font-size: 24px; margin-bottom: 16px;">Password Reset Request</h2>
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.5;">Hello %s,</p>
              <p style="color: #cbd5e1; font-size: 16px; line-height: 1.5;">We received a request to reset your password. Click the button below to set a new password:</p>
              <div style="margin: 28px 0; text-align: center;">
                <a href="%s" style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
              </div>
              <p style="color: #94a3b8; font-size: 14px;">Direct link:</p>
              <p style="color: #818cf8; word-break: break-all; font-size: 13px;">%s</p>
              <hr style="border: 0; border-top: 1px solid #334155; margin: 24px 0;" />
              <p style="color: #64748b; font-size: 12px;">This link will expire in 1 hour. If you did not request a password reset, please ignore this email.</p>
            </div>
            """.formatted(fullName, resetUrl, resetUrl);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    @Async
    public void sendOtpEmail(String toEmail, String fullName, String otpCode) {
        String subject = "CareerPilot — Your 6-Digit Login OTP: " + otpCode;
        String htmlContent = """
            <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #090d16; color: #f8fafc; padding: 32px; border-radius: 16px; border: 1px solid #312e81;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #818cf8; font-size: 28px; font-weight: 800; margin: 0;">CareerPilot AI</h1>
                <p style="color: #94a3b8; font-size: 14px; margin-top: 4px;">AI Career OS Authentication System</p>
              </div>
              <h2 style="color: #ffffff; font-size: 20px; margin-bottom: 16px;">Hello %s,</h2>
              <p style="color: #cbd5e1; font-size: 15px; line-height: 1.6;">Use the 6-digit One-Time Password (OTP) below to authenticate into your CareerPilot account:</p>
              
              <div style="margin: 32px 0; text-align: center;">
                <div style="display: inline-block; background: linear-gradient(135deg, #1e1b4b, #311b92); border: 2px dashed #6366f1; padding: 18px 36px; border-radius: 12px;">
                  <span style="font-size: 36px; font-weight: 900; letter-spacing: 12px; color: #38bdf8; font-family: monospace;">%s</span>
                </div>
              </div>
              
              <p style="color: #94a3b8; font-size: 13px; text-align: center;">⏱️ This verification code is valid for <strong>10 minutes</strong>. Do not share this OTP with anyone.</p>
              <hr style="border: 0; border-top: 1px solid #1e293b; margin: 28px 0;" />
              <p style="color: #64748b; font-size: 12px; text-align: center;">If you did not request this OTP, please secure your account immediately.</p>
            </div>
            """.formatted(fullName != null && !fullName.isBlank() ? fullName : "User", otpCode);

        sendHtmlEmail(toEmail, subject, htmlContent);
    }

    private void sendHtmlEmail(String toEmail, String subject, String htmlBody) {
        if (mailSender == null) {
            log.warn("JavaMailSender is not configured. Email to {} with subject '{}' was skipped.", toEmail, subject);
            return;
        }
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);
            mailSender.send(message);
            log.info("Successfully sent email to {} with subject: {}", toEmail, subject);
        } catch (Exception e) {
            log.error("Failed to send email to {}: {}", toEmail, e.getMessage(), e);
        }
    }
}
