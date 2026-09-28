package com.careerpilot.controller;

import com.careerpilot.dto.RoadmapDTOs.RoadmapResponse;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.RoadmapService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/roadmaps")
@Tag(name = "Learning Roadmap", description = "Personalized learning roadmap and portfolio project engine APIs")
public class RoadmapController {

    @Autowired
    private RoadmapService roadmapService;

    @GetMapping("/active")
    @Operation(summary = "Get active user personalized learning roadmap and project recommendations")
    public ResponseEntity<RoadmapResponse> getActiveRoadmap(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(roadmapService.getOrGenerateRoadmap(userId));
    }
}
