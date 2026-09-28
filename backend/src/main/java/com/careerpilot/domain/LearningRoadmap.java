package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "learning_roadmaps")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LearningRoadmap {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String targetRole;
    private Integer durationWeeks;
    private Integer progressPercent;

    @Column(columnDefinition = "CLOB")
    private String weeklyPlanJson; // List of weeks with topics, practice tasks, interview Qs, mini project, status

    @Column(columnDefinition = "CLOB")
    private String projectRecommendationsJson;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
