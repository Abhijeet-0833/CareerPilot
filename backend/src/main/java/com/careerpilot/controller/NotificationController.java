package com.careerpilot.controller;

import com.careerpilot.domain.Notification;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notifications")
@Tag(name = "Notifications", description = "User in-app notification management APIs")
public class NotificationController {

    @Autowired
    private NotificationService notificationService;

    @GetMapping
    @Operation(summary = "Get list of notifications for authenticated user")
    public ResponseEntity<List<Notification>> getNotifications(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(notificationService.getUserNotifications(userId));
    }

    @GetMapping("/unread-count")
    @Operation(summary = "Get count of unread notifications for authenticated user")
    public ResponseEntity<Map<String, Long>> getUnreadCount(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        long count = notificationService.getUnreadCount(userId);
        return ResponseEntity.ok(Map.of("unreadCount", count));
    }

    @PatchMapping("/{id}/read")
    @Operation(summary = "Mark a notification as read")
    public ResponseEntity<Void> markAsRead(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        notificationService.markAsRead(userId, id);
        return ResponseEntity.ok().build();
    }

    @PatchMapping("/read-all")
    @Operation(summary = "Mark all notifications as read")
    public ResponseEntity<Void> markAllAsRead(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        notificationService.markAllAsRead(userId);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Delete a notification")
    public ResponseEntity<Void> deleteNotification(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @PathVariable Long id) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        notificationService.deleteNotification(userId, id);
        return ResponseEntity.noContent().build();
    }
}
