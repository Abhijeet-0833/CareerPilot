package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "job_id", nullable = false)
    private Long jobId;

    private Integer matchScore;
    private Integer readinessScore;

    private Integer techSkillsMatch;
    private Integer experienceMatch;
    private Integer educationMatch;
    private Integer projectsMatch;
    private Integer keywordsMatch;

    @Column(columnDefinition = "CLOB")
    private String skillGapJson;

    @Column(columnDefinition = "CLOB")
    private String topActionItemsJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
