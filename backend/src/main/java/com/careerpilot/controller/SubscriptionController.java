package com.careerpilot.controller;

import com.careerpilot.dto.SubscriptionDTOs.*;
import com.careerpilot.security.SecurityUtils;
import com.careerpilot.security.UserPrincipal;
import com.careerpilot.service.SubscriptionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subscriptions")
@Tag(name = "Monetization & Billing", description = "Razorpay checkout and subscription management APIs")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @PostMapping("/checkout")
    @Operation(summary = "Create Razorpay order for subscription plan checkout (Sandbox / Test Mode)")
    public ResponseEntity<CheckoutResponse> createCheckout(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody CheckoutRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(subscriptionService.createCheckout(userId, request));
    }

    @PostMapping("/verify-upgrade")
    @Operation(summary = "Verify Razorpay payment signature and upgrade user plan tier")
    public ResponseEntity<SubscriptionResponse> verifyAndUpgrade(
            @AuthenticationPrincipal UserPrincipal userPrincipal,
            @RequestBody PaymentVerificationRequest request) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(subscriptionService.verifyAndUpgrade(userId, request));
    }

    @GetMapping("/current")
    @Operation(summary = "Get user active subscription status and plan features")
    public ResponseEntity<SubscriptionResponse> getSubscription(@AuthenticationPrincipal UserPrincipal userPrincipal) {
        Long userId = SecurityUtils.getRequiredUserId(userPrincipal);
        return ResponseEntity.ok(subscriptionService.getSubscription(userId));
    }
}
