package com.careerpilot.service;

import com.careerpilot.domain.Role;
import com.careerpilot.domain.User;
import com.careerpilot.domain.VerificationToken;
import com.careerpilot.dto.AuthDTOs.*;
import com.careerpilot.repository.UserProfileRepository;
import com.careerpilot.repository.UserRepository;
import com.careerpilot.repository.VerificationTokenRepository;
import com.careerpilot.repository.PasswordResetTokenRepository;
import com.careerpilot.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private VerificationTokenRepository verificationTokenRepository;

    @Mock
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Mock
    private EmailService emailService;

    @Mock
    private NotificationService notificationService;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtTokenProvider tokenProvider;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;

    @BeforeEach
    void setUp() {
        registerRequest = RegisterRequest.builder()
                .email("test@careerpilot.ai")
                .password("password123")
                .fullName("Test User")
                .role(Role.JOB_SEEKER)
                .build();
    }

    @Test
    void register_Success() {
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashedPassword");
        
        User savedUser = User.builder()
                .id(100L)
                .email("test@careerpilot.ai")
                .fullName("Test User")
                .role(Role.JOB_SEEKER)
                .build();

        when(userRepository.saveAndFlush(any(User.class))).thenReturn(savedUser);
        when(tokenProvider.generateTokenForUserId(eq(100L), anyString())).thenReturn("jwt_test_token");

        AuthResponse response = authService.register(registerRequest);

        assertNotNull(response);
        assertEquals("test@careerpilot.ai", response.getEmail());
        assertEquals("jwt_test_token", response.getToken());
        verify(userRepository, times(1)).saveAndFlush(any(User.class));
        verify(verificationTokenRepository, times(1)).saveAndFlush(any(VerificationToken.class));
    }

    @Test
    void register_DuplicateEmail_ThrowsException() {
        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(RuntimeException.class, () -> authService.register(registerRequest));
        verify(userRepository, never()).saveAndFlush(any(User.class));
    }

    @Test
    void resendVerification_Success() {
        User user = User.builder().id(100L).email("test@careerpilot.ai").emailVerified(false).fullName("Test User").build();
        when(userRepository.findByEmail("test@careerpilot.ai")).thenReturn(Optional.of(user));

        ApiResponseMsg msg = authService.resendVerification("test@careerpilot.ai");

        assertNotNull(msg);
        assertTrue(msg.isSuccess());
        verify(verificationTokenRepository, times(1)).deleteByUser(user);
        verify(verificationTokenRepository, times(1)).flush();
        verify(verificationTokenRepository, times(1)).saveAndFlush(any(VerificationToken.class));
    }

    @Test
    void verifyEmail_Success() {
        User user = User.builder().id(100L).email("test@careerpilot.ai").emailVerified(false).build();
        VerificationToken token = VerificationToken.builder()
                .id(1L)
                .token("valid_token")
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .build();

        when(verificationTokenRepository.findByToken("valid_token")).thenReturn(Optional.of(token));

        ApiResponseMsg res = authService.verifyEmail("valid_token");

        assertNotNull(res);
        assertTrue(res.isSuccess());
        assertTrue(user.isEmailVerified());
        assertNotNull(token.getUsedAt());
    }

    @Test
    void verifyEmail_UsedToken_ThrowsException() {
        User user = User.builder().id(100L).email("test@careerpilot.ai").emailVerified(true).build();
        VerificationToken token = VerificationToken.builder()
                .id(1L)
                .token("used_token")
                .user(user)
                .expiryDate(LocalDateTime.now().plusHours(1))
                .usedAt(LocalDateTime.now().minusMinutes(5))
                .build();

        when(verificationTokenRepository.findByToken("used_token")).thenReturn(Optional.of(token));

        assertThrows(RuntimeException.class, () -> authService.verifyEmail("used_token"));
    }
}
