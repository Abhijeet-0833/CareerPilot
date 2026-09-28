package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_analysis_history")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeAnalysisHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String targetJobTitle;
    private String companyName;

    private Integer beforeAtsScore;
    private Integer afterAtsScore;
    private Integer scoreImprovement;

    @Column(columnDefinition = "CLOB")
    private String keywordsAddedJson;

    @Column(columnDefinition = "CLOB")
    private String scoreBreakdownJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
