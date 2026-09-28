package com.careerpilot.controller;

import com.careerpilot.dto.AuthDTOs.*;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@Tag(name = "Authentication", description = "User registration, login, email verification, password reset, and JWT management APIs")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    @Operation(summary = "Register a new user account with email verification requirement")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    @Operation(summary = "Authenticate user and issue JWT bearer token (requires verified email)")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    @GetMapping("/verify-email")
    @Operation(summary = "Verify user email address using single-use token")
    public ResponseEntity<ApiResponseMsg> verifyEmail(@RequestParam("token") String token) {
        return ResponseEntity.ok(authService.verifyEmail(token));
    }

    @PostMapping("/resend-verification")
    @Operation(summary = "Resend email verification token")
    public ResponseEntity<ApiResponseMsg> resendVerification(@Valid @RequestBody ResendVerificationRequest request) {
        return ResponseEntity.ok(authService.resendVerification(request.getEmail()));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Request password reset email link")
    public ResponseEntity<ApiResponseMsg> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        return ResponseEntity.ok(authService.forgotPassword(request));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Reset account password using single-use reset token")
    public ResponseEntity<ApiResponseMsg> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }

    @PostMapping("/change-password")
    @Operation(summary = "Change password for authenticated user")
    public ResponseEntity<ApiResponseMsg> changePassword(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @Valid @RequestBody ChangePasswordRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(authService.changePassword(userId, request));
    }

    @PostMapping("/logout")
    @Operation(summary = "Revoke session / logout authenticated user")
    public ResponseEntity<ApiResponseMsg> logout() {
        return ResponseEntity.ok(ApiResponseMsg.of(true, "Successfully logged out"));
    }

    @GetMapping("/dev-token")
    @Operation(summary = "Get verification token for dev/test")
    public ResponseEntity<ApiResponseMsg> getDevToken(@RequestParam("email") String email) {
        return ResponseEntity.ok(ApiResponseMsg.of(true, authService.getVerificationTokenForUser(email)));
    }

    @PostMapping("/send-otp")
    @Operation(summary = "Send 6-digit OTP code to email via Gmail SMTP for OTP authentication")
    public ResponseEntity<ApiResponseMsg> sendOtp(@Valid @RequestBody SendOtpRequest request) {
        return ResponseEntity.ok(authService.sendOtp(request));
    }

    @PostMapping("/verify-otp")
    @Operation(summary = "Verify 6-digit OTP code and issue JWT bearer token")
    public ResponseEntity<AuthResponse> verifyOtp(@Valid @RequestBody VerifyOtpRequest request) {
        return ResponseEntity.ok(authService.verifyOtp(request));
    }
}
