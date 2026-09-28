package com.careerpilot.controller;

import com.careerpilot.dto.ProfileDTOs.UserProfileDTO;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.UserProfileService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@Tag(name = "User Profile", description = "Candidate profile management APIs")
public class UserProfileController {

    @Autowired
    private UserProfileService userProfileService;

    @GetMapping("/profile")
    @Operation(summary = "Get current authenticated user profile")
    public ResponseEntity<UserProfileDTO> getProfile(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(userProfileService.getProfileByUserId(userId));
    }

    @PutMapping("/profile")
    @Operation(summary = "Update career profile information")
    public ResponseEntity<UserProfileDTO> updateProfile(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody UserProfileDTO dto) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(userProfileService.updateProfile(userId, dto));
    }
}
