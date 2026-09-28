package com.careerpilot.dto;

import com.careerpilot.domain.Subscription.PlanTier;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class SubscriptionDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CheckoutRequest {
        private PlanTier planTier;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CheckoutResponse {
        private String razorpayOrderId;
        private String razorpayKeyId;
        private Double amount;
        private String currency;
        private PlanTier planTier;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class PaymentVerificationRequest {
        private String razorpayOrderId;
        private String razorpayPaymentId;
        private String razorpaySignature;
        private PlanTier planTier;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SubscriptionResponse {
        private Long id;
        private Long userId;
        private PlanTier planTier;
        private String status;
        private Double pricePaid;
        private String expiresAt;
    }
}
