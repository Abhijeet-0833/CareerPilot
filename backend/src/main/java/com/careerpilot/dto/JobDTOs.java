package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

public class JobDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JDAnalysisRequest {
        private String jobTitle;
        private String companyName;
        private String rawJdText;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JDAnalysisResponse {
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private String location;
        private String experienceRequired;
        private String salaryRange;
        private List<String> mustHaveSkills;
        private List<String> goodToHaveSkills;
        private List<String> responsibilities;
        private List<String> extractedKeywords;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class JobMatchResponse {
        private Long matchId;
        private Long jobId;
        private String jobTitle;
        private String companyName;
        private Integer matchScore;
        private Integer readinessScore;
        private Integer techSkillsMatch;
        private Integer experienceMatch;
        private Integer educationMatch;
        private Integer projectsMatch;
        private Integer keywordsMatch;
        private List<String> missingSkills;
        private List<String> weakSkills;
        private List<String> strongSkills;
        private List<String> top3ActionItems;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MarketSkillAnalytics {
        private String targetRole;
        private Integer totalJDsAnalyzed;
        private Map<String, Integer> topSkillsDemand; // Skill -> Percentage demand
        private List<String> highDemandKeywords;
    }
}
