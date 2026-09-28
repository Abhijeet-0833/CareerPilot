package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class RoadmapDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapTask {
        private String id;
        private String topic;
        private String objective;
        private List<String> subtopics;
        private List<String> practiceTasks;
        private List<String> interviewQuestions;
        private String miniProject;
        private Boolean isCompleted;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WeeklyPlan {
        private Integer weekNumber;
        private String weekTitle;
        private List<RoadmapTask> tasks;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ProjectRecommendation {
        private String title;
        private String problemStatement;
        private List<String> keyFeatures;
        private String architecture;
        private String techStack;
        private List<String> apiEndpoints;
        private List<String> resumeBulletPoints;
        private String interviewExplanation;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class RoadmapResponse {
        private Long roadmapId;
        private String targetRole;
        private Integer durationWeeks;
        private Integer progressPercent;
        private List<WeeklyPlan> weeklyPlans;
        private List<ProjectRecommendation> recommendedProjects;
    }
}
