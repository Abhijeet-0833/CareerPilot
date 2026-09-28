package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;
import java.util.Map;

public class ResumeDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeUploadRequest {
        private String fileName;
        private String rawText;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ATSAnalysisResult {
        private Long resumeId;
        private Integer overallAtsScore;
        private Integer keywordsScore;
        private Integer skillsScore;
        private Integer experienceScore;
        private Integer projectsScore;
        private Integer formattingScore;
        private Integer readabilityScore;
        private List<String> detectedSkills;
        private List<String> missingKeywords;
        private List<String> formattingSuggestions;
        private List<String> actionableRecommendations;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class DiffItem {
        private String id;
        private String changeType; // ADDED (green), MODIFIED (yellow), REMOVED (red)
        private String section;
        private String originalText;
        private String optimizedText;
        private Boolean accepted;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SkillConfirmationItem {
        private String skillName;
        private String priority; // HIGH, MEDIUM, LOW
        private Boolean inResume;
        private Boolean inJd;
        private Boolean userConfirmed; // User must confirm before adding to resume
        private String recommendationNote;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class StructureAnalysisResult {
        private List<String> sectionsDetected;
        private List<String> missingSections;
        private Boolean hasAtsUnfriendlyFormatting;
        private List<String> formattingAlerts; // Tables, text boxes, image headers
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ScoreComparisonResult {
        private Integer beforeAtsScore;
        private Integer afterAtsScore;
        private Integer scoreImprovement; // e.g. +17 ATS Improvement
        private Map<String, Integer> beforeCategoryScores;
        private Map<String, Integer> afterCategoryScores;
        private List<String> keywordsAdded;
        private List<String> scoreImprovementExplanations;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class QualityCheckResult {
        private Boolean passed;
        private Boolean missingContactInfo;
        private List<String> brokenLinks;
        private List<String> duplicateBulletPoints;
        private List<String> spellingGrammarWarnings;
        private List<String> formattingIssues;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TailoredResumeRequest {
        private Long targetJobId;
        private String targetJdText;
        private String rawResumeText;
        private List<String> userConfirmedSkills;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TailoredResumeResult {
        private String candidateName;
        private String optimizedSummary;
        private List<String> reorderedSkills;
        private List<String> tailoredExperienceBullets;
        private List<String> highlightedProjects;
        private List<String> matchingKeywordsAdded;
        private List<DiffItem> proposedDiffs;
        private ScoreComparisonResult scoreComparison;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeVersionDTO {
        private Long id;
        private Long userId;
        private String versionName;
        private String targetRole;
        private String companyName;
        private String templateName;
        private Integer originalAtsScore;
        private Integer optimizedAtsScore;
        private String tailoredText;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeAnalysisHistoryDTO {
        private Long id;
        private String targetJobTitle;
        private String companyName;
        private Integer beforeAtsScore;
        private Integer afterAtsScore;
        private Integer scoreImprovement;
        private String createdAt;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ResumeExportRequest {
        private String title;
        private String content;
        private String fileName;
        private String format;
    }
}
