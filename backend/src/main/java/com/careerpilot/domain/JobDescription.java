package com.careerpilot.domain;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_descriptions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobDescription {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String jobTitle;
    private String companyName;
    private String location;
    private String experienceRequired;
    private String salaryRange;

    @Column(columnDefinition = "CLOB")
    private String rawJdText;

    @Column(columnDefinition = "CLOB")
    private String mustHaveSkillsJson;

    @Column(columnDefinition = "CLOB")
    private String goodToHaveSkillsJson;

    @Column(columnDefinition = "CLOB")
    private String responsibilitiesJson;

    @Column(columnDefinition = "CLOB")
    private String keywordsJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
