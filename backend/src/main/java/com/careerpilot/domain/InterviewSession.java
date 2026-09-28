package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "interview_sessions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewSession {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String interviewType; // HR, Java, Spring Boot, SQL, System Design, Behavioral
    private String targetRole;
    private Integer overallScore;
    private Integer techScore;
    private Integer commScore;
    private Boolean isCompleted;

    @Column(columnDefinition = "CLOB")
    private String transcriptJson; // List of Q&A with dynamic feedback & communication analysis

    @Column(columnDefinition = "CLOB")
    private String finalEvaluationJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.isCompleted == null) {
            this.isCompleted = false;
        }
    }
}
