package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "master_resumes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MasterResume {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    private String fileName;

    @Column(columnDefinition = "CLOB")
    private String rawText;

    @Column(columnDefinition = "CLOB")
    private String parsedSkillsJson;

    @Column(columnDefinition = "CLOB")
    private String experienceJson;

    @Column(columnDefinition = "CLOB")
    private String projectsJson;

    @Column(columnDefinition = "CLOB")
    private String educationJson;

    private Integer atsScore;
    private Integer keywordsScore;
    private Integer skillsScore;
    private Integer experienceScore;
    private Integer projectsScore;
    private Integer formattingScore;

    @Column(columnDefinition = "CLOB")
    private String recommendationsJson;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    @PreUpdate
    protected void onSave() {
        this.updatedAt = LocalDateTime.now();
    }
}
