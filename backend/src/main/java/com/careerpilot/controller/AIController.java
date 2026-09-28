package com.careerpilot.controller;

import com.careerpilot.domain.MasterResume;
import com.careerpilot.domain.UserProfile;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.ResumeService;
import com.careerpilot.service.UserProfileService;
import com.careerpilot.service.ai.AIProvider;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@Tag(name = "AI Career Coach", description = "Context-aware AI Career Chatbot and recruiter outreach generator APIs")
public class AIController {

    @Autowired
    private AIProvider aiProvider;

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private ResumeService resumeService;

    @PostMapping("/chat")
    @Operation(summary = "Ask the context-aware AI Career Coach a question")
    public ResponseEntity<Map<String, String>> chat(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        String userMessage = body.getOrDefault("message", "Hello");

        UserProfile profile = null;
        MasterResume resume = null;
        try {
            var profileDto = userProfileService.getProfileByUserId(userId);
            if (profileDto != null) {
                profile = UserProfile.builder()
                        .userId(userId)
                        .targetRole(profileDto.getTargetRole())
                        .experienceYears(profileDto.getExperienceYears())
                        .location(profileDto.getLocation())
                        .summary(profileDto.getSummary())
                        .build();
            }
            resume = resumeService.getMasterResume(userId);
        } catch (Exception ignored) {}

        String reply = aiProvider.chatCareerCoach(profile, resume, userMessage);
        return ResponseEntity.ok(Map.of("reply", reply));
    }

    @PostMapping("/outreach")
    @Operation(summary = "Generate recruiter email, LinkedIn note, or cover letter based on user profile and target job")
    public ResponseEntity<Map<String, String>> generateOutreach(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody Map<String, String> body) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        String type = body.getOrDefault("type", "COVER_LETTER");

        UserProfile profile = UserProfile.builder().userId(userId).build();
        try {
            var profileDto = userProfileService.getProfileByUserId(userId);
            if (profileDto != null) {
                profile.setTargetRole(profileDto.getTargetRole());
            }
        } catch (Exception ignored) {}

        String content = aiProvider.generateOutreachMessage(profile, null, type);
        return ResponseEntity.ok(Map.of("content", content));
    }
}
