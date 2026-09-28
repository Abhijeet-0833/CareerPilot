package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "applications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Application {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(nullable = false)
    private String companyName;

    @Column(nullable = false)
    private String jobTitle;

    private String location;
    private String salaryRange;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ApplicationStatus status; // SAVED, APPLIED, ASSESSMENT, INTERVIEW, HR, OFFER, REJECTED

    private String appliedDate;
    private String followUpDate;
    private String contactPerson;

    @Column(columnDefinition = "TEXT")
    private String notes;

    @Column(columnDefinition = "CLOB")
    private String jdText;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    public enum ApplicationStatus {
        SAVED,
        APPLIED,
        ASSESSMENT,
        INTERVIEW,
        HR,
        OFFER,
        REJECTED
    }

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = ApplicationStatus.SAVED;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
