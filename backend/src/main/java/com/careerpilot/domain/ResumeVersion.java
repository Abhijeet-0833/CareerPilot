package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_versions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeVersion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String versionName; // e.g. "Stripe Senior Java Engineer v1"
    private String targetRole;
    private String companyName;
    private String templateName; // Modern ATS, Professional ATS, Minimal ATS, Technical ATS

    private Integer originalAtsScore;
    private Integer optimizedAtsScore;

    @Column(columnDefinition = "CLOB")
    private String tailoredText;

    @Column(columnDefinition = "CLOB")
    private String diffChangesJson; // Added (green), Modified (yellow), Removed (red)

    @Column(columnDefinition = "CLOB")
    private String confirmedSkillsJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.templateName == null) {
            this.templateName = "Modern ATS";
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
