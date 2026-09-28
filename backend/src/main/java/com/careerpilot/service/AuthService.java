package com.careerpilot.service;

import com.careerpilot.domain.*;
import com.careerpilot.dto.AuthDTOs.*;
import com.careerpilot.repository.*;
import com.careerpilot.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private OtpTokenRepository otpTokenRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        if (request.getConfirmPassword() != null && !request.getPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        // Public registration defaults strictly to JOB_SEEKER
        Role role = Role.JOB_SEEKER;
        if (request.getRole() == Role.RECRUITER) {
            role = Role.RECRUITER;
        }

        User user = User.builder()
                .email(request.getEmail().toLowerCase().trim())
                .password(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .role(role)
                .emailVerified(false)
                .build();

        // 1. Save User and flush so user.getId() is immediately available
        User savedUser = userRepository.saveAndFlush(user);

        // 2. Initialize UserProfile
        UserProfile profile = UserProfile.builder()
                .userId(savedUser.getId())
                .targetRole("Software Engineer")
                .experienceYears(1)
                .location("San Francisco, CA")
                .build();
        userProfileRepository.save(profile);

        // 3. Generate Verification Token linked to persisted savedUser
        String tokenStr = UUID.randomUUID().toString();
        VerificationToken vToken = VerificationToken.builder()
                .token(tokenStr)
                .user(savedUser)
                .expiryDate(LocalDateTime.now().plusDays(1))
                .build();
        verificationTokenRepository.saveAndFlush(vToken);

        // 4. Send Verification Email asynchronously
        emailService.sendVerificationEmail(savedUser.getEmail(), savedUser.getFullName(), tokenStr);

        String jwt = tokenProvider.generateTokenForUserId(savedUser.getId(), savedUser.getEmail());

        return AuthResponse.of(jwt, savedUser.getId(), savedUser.getEmail(), savedUser.getFullName(), savedUser.getRole(), false);
    }

    public AuthResponse login(LoginRequest request) {
        String emailClean = request.getEmail().toLowerCase().trim();
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(emailClean, request.getPassword())
        );

        User user = userRepository.findByEmail(emailClean)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + emailClean));

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Please verify your email before signing in.");
        }

        String token = tokenProvider.generateToken(authentication);

        return AuthResponse.of(token, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), true);
    }

    @Transactional
    public ApiResponseMsg verifyEmail(String tokenStr) {
        VerificationToken vToken = verificationTokenRepository.findByToken(tokenStr)
                .orElseThrow(() -> new RuntimeException("Invalid verification token"));

        if (vToken.getUsedAt() != null) {
            throw new RuntimeException("Verification token has already been used");
        }

        if (vToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has expired. Please request a new verification email.");
        }

        User user = vToken.getUser();
        user.setEmailVerified(true);
        userRepository.save(user);

        vToken.setUsedAt(LocalDateTime.now());
        verificationTokenRepository.save(vToken);

        // Trigger welcome notification
        notificationService.createNotification(
                user.getId(),
                "EMAIL_VERIFIED",
                "Email Verified Successfully! 🎉",
                "Welcome to CareerPilot. Your account is fully active and ready for AI resume optimization and job tracking.",
                "/dashboard"
        );

        return ApiResponseMsg.of(true, "Email address verified successfully. You may now sign in.");
    }

    @Transactional
    public ApiResponseMsg resendVerification(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found with email: " + email));

        if (user.isEmailVerified()) {
            return ApiResponseMsg.of(true, "Your email is already verified.");
        }

        // Delete old token and flush deletion to avoid unique constraint flush order issues
        verificationTokenRepository.deleteByUser(user);
        verificationTokenRepository.flush();

        String tokenStr = UUID.randomUUID().toString();
        VerificationToken vToken = VerificationToken.builder()
                .token(tokenStr)
                .user(user)
                .expiryDate(LocalDateTime.now().plusDays(1))
                .build();
        verificationTokenRepository.saveAndFlush(vToken);

        emailService.sendVerificationEmail(user.getEmail(), user.getFullName(), tokenStr);

        return ApiResponseMsg.of(true, "A new verification email has been sent to " + email);
    }

    @Transactional
    public ApiResponseMsg forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail().toLowerCase().trim()).ifPresent(user -> {
            passwordResetTokenRepository.deleteByUser(user);
            passwordResetTokenRepository.flush();

            String tokenStr = UUID.randomUUID().toString();
            PasswordResetToken prToken = PasswordResetToken.builder()
                    .token(tokenStr)
                    .user(user)
                    .expiryDate(LocalDateTime.now().plusHours(1))
                    .build();
            passwordResetTokenRepository.saveAndFlush(prToken);

            emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), tokenStr);
        });

        return ApiResponseMsg.of(true, "If an account exists for that email, a password reset link has been sent.");
    }

    @Transactional
    public ApiResponseMsg resetPassword(ResetPasswordRequest request) {
        if (request.getConfirmPassword() != null && !request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        PasswordResetToken prToken = passwordResetTokenRepository.findByToken(request.getToken())
                .orElseThrow(() -> new RuntimeException("Invalid or expired password reset token"));

        if (prToken.getUsedAt() != null) {
            throw new RuntimeException("Password reset token has already been used");
        }

        if (prToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Password reset token has expired. Please request a new password reset link.");
        }

        User user = prToken.getUser();
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        prToken.setUsedAt(LocalDateTime.now());
        passwordResetTokenRepository.save(prToken);

        notificationService.createNotification(
                user.getId(),
                "PASSWORD_RESET",
                "Password Changed",
                "Your account password was reset successfully.",
                "/profile"
        );

        return ApiResponseMsg.of(true, "Password has been reset successfully. You can now sign in with your new password.");
    }

    @Transactional
    public ApiResponseMsg changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(request.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Incorrect current password");
        }

        if (request.getConfirmPassword() != null && !request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponseMsg.of(true, "Password updated successfully");
    }

    public String getVerificationTokenForUser(String email) {
        User user = userRepository.findByEmail(email.toLowerCase().trim())
                .orElseThrow(() -> new RuntimeException("User not found"));
        return verificationTokenRepository.findTopByUserOrderByCreatedAtDesc(user)
                .map(VerificationToken::getToken)
                .orElseThrow(() -> new RuntimeException("No verification token found"));
    }

    @Transactional
    public ApiResponseMsg sendOtp(SendOtpRequest request) {
        String emailClean = request.getEmail().toLowerCase().trim();

        User user = userRepository.findByEmail(emailClean).orElseGet(() -> {
            User newUser = User.builder()
                    .email(emailClean)
                    .password(passwordEncoder.encode(UUID.randomUUID().toString()))
                    .fullName(emailClean.split("@")[0])
                    .role(Role.JOB_SEEKER)
                    .emailVerified(false)
                    .build();
            User saved = userRepository.saveAndFlush(newUser);

            UserProfile profile = UserProfile.builder()
                    .userId(saved.getId())
                    .targetRole("Software Engineer")
                    .experienceYears(1)
                    .location("Remote")
                    .build();
            userProfileRepository.save(profile);

            return saved;
        });

        otpTokenRepository.deleteByEmail(emailClean);
        otpTokenRepository.flush();

        String otpCode = String.format("%06d", java.util.concurrent.ThreadLocalRandom.current().nextInt(100000, 1000000));

        OtpToken otpToken = OtpToken.builder()
                .email(emailClean)
                .otpCode(otpCode)
                .expiryDate(LocalDateTime.now().plusMinutes(10))
                .build();
        otpTokenRepository.saveAndFlush(otpToken);

        emailService.sendOtpEmail(emailClean, user.getFullName(), otpCode);

        return ApiResponseMsg.of(true, "A 6-digit OTP has been sent via Gmail to " + emailClean);
    }

    @Transactional
    public AuthResponse verifyOtp(VerifyOtpRequest request) {
        String emailClean = request.getEmail().toLowerCase().trim();
        String code = request.getOtpCode().trim();

        OtpToken otpToken = otpTokenRepository.findTopByEmailOrderByCreatedAtDesc(emailClean)
                .orElseThrow(() -> new RuntimeException("No OTP requested or OTP has expired for " + emailClean));

        if (otpToken.getUsedAt() != null) {
            throw new RuntimeException("This OTP code has already been used");
        }

        if (otpToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("OTP code has expired. Please request a new OTP.");
        }

        if (!otpToken.getOtpCode().equals(code)) {
            throw new RuntimeException("Invalid OTP code. Please check your email and try again.");
        }

        otpToken.setUsedAt(LocalDateTime.now());
        otpTokenRepository.save(otpToken);

        User user = userRepository.findByEmail(emailClean)
                .orElseThrow(() -> new RuntimeException("User not found with email: " + emailClean));

        if (!user.isEmailVerified()) {
            user.setEmailVerified(true);
            userRepository.save(user);
        }

        String jwt = tokenProvider.generateTokenForUserId(user.getId(), user.getEmail());

        notificationService.createNotification(
                user.getId(),
                "OTP_LOGIN",
                "OTP Login Successful! 🔑",
                "Authenticated successfully using 6-Digit Email OTP.",
                "/dashboard"
        );

        return AuthResponse.of(jwt, user.getId(), user.getEmail(), user.getFullName(), user.getRole(), true);
    }
}
