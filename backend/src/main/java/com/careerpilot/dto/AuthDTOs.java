package com.careerpilot.dto;

import com.careerpilot.domain.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class AuthDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RegisterRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 6, max = 100)
        private String password;

        @NotBlank
        private String fullName;

        private String confirmPassword;

        private Role role;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoginRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        private String password;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ForgotPasswordRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResetPasswordRequest {
        @NotBlank
        private String token;

        @NotBlank
        @Size(min = 6, max = 100)
        private String newPassword;

        private String confirmPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ChangePasswordRequest {
        @NotBlank
        private String oldPassword;

        @NotBlank
        @Size(min = 6, max = 100)
        private String newPassword;

        private String confirmPassword;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResendVerificationRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SendOtpRequest {
        @NotBlank
        @Email
        private String email;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class VerifyOtpRequest {
        @NotBlank
        @Email
        private String email;

        @NotBlank
        @Size(min = 4, max = 10)
        private String otpCode;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AuthResponse {
        private String token;
        private String refreshToken;
        private String tokenType;
        private Long userId;
        private String email;
        private String fullName;
        private Role role;
        private boolean emailVerified;

        public static AuthResponse of(String token, Long userId, String email, String fullName, Role role, boolean emailVerified) {
            return AuthResponse.builder()
                    .token(token)
                    .refreshToken(token + "_refresh")
                    .tokenType("Bearer")
                    .userId(userId)
                    .email(email)
                    .fullName(fullName)
                    .role(role)
                    .emailVerified(emailVerified)
                    .build();
        }
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApiResponseMsg {
        private boolean success;
        private String message;

        public static ApiResponseMsg of(boolean success, String message) {
            return new ApiResponseMsg(success, message);
        }
    }
}
