package com.careerpilot.controller;

import com.careerpilot.dto.JobDTOs.*;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.JobAnalysisService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/jobs")
@Tag(name = "Job & JD Analysis", description = "Job description parser, job match score, and market analytics APIs")
public class JobController {

    @Autowired
    private JobAnalysisService jobAnalysisService;

    @PostMapping("/analyze-jd")
    @Operation(summary = "Parse job description and extract MUST-HAVE vs GOOD-TO-HAVE skills")
    public ResponseEntity<JDAnalysisResponse> analyzeJD(@RequestBody JDAnalysisRequest request) {
        return ResponseEntity.ok(jobAnalysisService.analyzeJD(request));
    }

    @PostMapping("/{jobId}/match")
    @Operation(summary = "Calculate Job Match Score and Job Readiness Score for candidate profile")
    public ResponseEntity<JobMatchResponse> matchJob(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long jobId) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(jobAnalysisService.matchJob(userId, jobId));
    }

    @GetMapping("/market-analytics")
    @Operation(summary = "Fetch market skill analytics and high-demand tech keywords for target role")
    public ResponseEntity<MarketSkillAnalytics> getMarketAnalytics(@RequestParam(required = false) String targetRole) {
        return ResponseEntity.ok(jobAnalysisService.getMarketSkillAnalytics(targetRole));
    }
}
