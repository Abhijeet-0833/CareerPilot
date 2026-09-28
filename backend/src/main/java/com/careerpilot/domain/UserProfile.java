package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "user_profiles")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false, unique = true)
    private Long userId;

    private String phone;
    private String location;
    private String preferredLocations;
    private Integer experienceYears;
    private String education;
    private String technicalSkills;
    private String softSkills;
    private String targetRole;
    private Double expectedSalary;
    private String workPreference; // Remote, Hybrid, On-site
    private String noticePeriod;
    private String linkedinUrl;
    private String githubUrl;
    private String portfolioUrl;

    @Column(columnDefinition = "TEXT")
    private String summary;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
