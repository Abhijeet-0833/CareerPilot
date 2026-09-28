package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "subscriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subscription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PlanTier planTier; // FREE, PRO, PREMIUM, BUSINESS, COLLEGE

    private String status; // ACTIVE, CANCELLED, EXPIRED
    private Double pricePaid;
    private String paymentId;
    private String razorpayOrderId;
    private LocalDateTime expiresAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public enum PlanTier {
        FREE,
        PRO,
        PREMIUM,
        BUSINESS,
        COLLEGE
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.planTier == null) {
            this.planTier = PlanTier.FREE;
        }
        if (this.status == null) {
            this.status = "ACTIVE";
        }
    }
}
