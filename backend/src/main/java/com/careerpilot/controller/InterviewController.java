package com.careerpilot.controller;

import com.careerpilot.domain.InterviewSession;
import com.careerpilot.dto.InterviewDTOs.*;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/interviews")
@Tag(name = "AI Mock Interview", description = "AI Interviewer simulator and English & Communication Coach APIs")
public class InterviewController {

    @Autowired
    private InterviewService interviewService;

    @PostMapping("/start")
    @Operation(summary = "Start a new interactive AI mock interview session")
    public ResponseEntity<InterviewSession> startSession(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody InterviewStartRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(interviewService.startSession(userId, request));
    }

    @PostMapping("/submit-answer")
    @Operation(summary = "Submit interview response for real-time AI scoring, filler word analysis, and next question")
    public ResponseEntity<AnswerEvaluation> submitAnswer(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody AnswerSubmitRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(interviewService.submitAnswer(userId, request));
    }

    @GetMapping("/{sessionId}/final-evaluation")
    @Operation(summary = "Get final interview scorecard, key strengths, and communication advice")
    public ResponseEntity<FinalEvaluationResponse> getFinalEvaluation(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long sessionId) {
        SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(interviewService.getFinalEvaluation(sessionId));
    }
}
