package com.careerpilot.service;

import com.careerpilot.domain.Subscription;
import com.careerpilot.domain.Subscription.PlanTier;
import com.careerpilot.dto.SubscriptionDTOs.*;
import com.careerpilot.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private NotificationService notificationService;

    public CheckoutResponse createCheckout(Long userId, CheckoutRequest request) {
        PlanTier tier = request.getPlanTier() != null ? request.getPlanTier() : PlanTier.PRO;
        double amount = switch (tier) {
            case PRO -> 29.00;
            case PREMIUM -> 59.00;
            case BUSINESS -> 199.00;
            case COLLEGE -> 499.00;
            default -> 0.00;
        };

        String orderId = "order_rzp_" + System.currentTimeMillis();

        return CheckoutResponse.builder()
                .razorpayOrderId(orderId)
                .razorpayKeyId("rzp_test_careerpilot_key")
                .amount(amount)
                .currency("USD")
                .planTier(tier)
                .build();
    }

    public SubscriptionResponse verifyAndUpgrade(Long userId, PaymentVerificationRequest request) {
        Subscription subscription = subscriptionRepository.findByUserId(userId)
                .orElse(Subscription.builder().userId(userId).build());

        PlanTier newTier = request.getPlanTier() != null ? request.getPlanTier() : PlanTier.PRO;
        double pricePaid = switch (newTier) {
            case PRO -> 29.00;
            case PREMIUM -> 59.00;
            case BUSINESS -> 199.00;
            case COLLEGE -> 499.00;
            default -> 0.00;
        };

        subscription.setPlanTier(newTier);
        subscription.setStatus("ACTIVE");
        subscription.setPricePaid(pricePaid);
        subscription.setRazorpayOrderId(request.getRazorpayOrderId());
        subscription.setPaymentId(request.getRazorpayPaymentId() != null ? request.getRazorpayPaymentId() : "pay_" + System.currentTimeMillis());
        subscription.setExpiresAt(LocalDateTime.now().plusMonths(1));

        Subscription updated = subscriptionRepository.save(subscription);

        // Send payment confirmation notification
        notificationService.createNotification(
                userId,
                "PAYMENT_SUCCESS",
                "Subscription Upgraded to " + newTier.name() + "! 🚀",
                "Your payment was verified in TEST Sandbox mode. You now have access to " + newTier.name() + " plan features.",
                "/pricing"
        );

        return SubscriptionResponse.builder()
                .id(updated.getId())
                .userId(updated.getUserId())
                .planTier(updated.getPlanTier())
                .status(updated.getStatus())
                .pricePaid(updated.getPricePaid())
                .expiresAt(updated.getExpiresAt() != null ? updated.getExpiresAt().toString() : null)
                .build();
    }

    public SubscriptionResponse getSubscription(Long userId) {
        Subscription sub = subscriptionRepository.findByUserId(userId)
                .orElseGet(() -> subscriptionRepository.save(Subscription.builder()
                        .userId(userId)
                        .planTier(PlanTier.FREE)
                        .status("ACTIVE")
                        .pricePaid(0.0)
                        .build()));

        return SubscriptionResponse.builder()
                .id(sub.getId())
                .userId(sub.getUserId())
                .planTier(sub.getPlanTier())
                .status(sub.getStatus())
                .pricePaid(sub.getPricePaid() != null ? sub.getPricePaid() : 0.0)
                .expiresAt(sub.getExpiresAt() != null ? sub.getExpiresAt().toString() : "Never")
                .build();
    }
}
