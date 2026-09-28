package com.careerpilot.controller;

import com.careerpilot.domain.Application.ApplicationStatus;
import com.careerpilot.dto.ApplicationDTOs.ApplicationDTO;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.ApplicationTrackerService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@Tag(name = "Application Tracker", description = "Kanban job application pipeline management APIs")
public class ApplicationController {

    @Autowired
    private ApplicationTrackerService applicationTrackerService;

    @GetMapping
    @Operation(summary = "Get list of user job applications")
    public ResponseEntity<List<ApplicationDTO>> getUserApplications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(applicationTrackerService.getUserApplications(userId));
    }

    @PostMapping
    @Operation(summary = "Track a new job application")
    public ResponseEntity<ApplicationDTO> createApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody ApplicationDTO dto) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(applicationTrackerService.createApplication(userId, dto));
    }

    @PutMapping("/{id}/status")
    @Operation(summary = "Update Kanban application status stage (e.g. APPLIED -> INTERVIEW)")
    public ResponseEntity<ApplicationDTO> updateStatus(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id,
            @RequestParam ApplicationStatus status) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(applicationTrackerService.updateStatus(userId, id, status));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete an application entry")
    public ResponseEntity<Void> deleteApplication(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        applicationTrackerService.deleteApplication(userId, id);
        return ResponseEntity.noContent().build();
    }
}
