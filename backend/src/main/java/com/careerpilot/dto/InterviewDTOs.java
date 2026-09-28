package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class InterviewDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewStartRequest {
        private String interviewType; // HR, Java, Spring Boot, SQL, System Design, Behavioral
        private String targetRole;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerSubmitRequest {
        private Long sessionId;
        private Integer questionIndex;
        private String questionText;
        private String userAnswer;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class AnswerEvaluation {
        private Integer score;
        private String feedback;
        private String technicalClarity;
        private String grammarFeedback;
        private List<String> detectedFillerWords;
        private String improvedExampleAnswer;
        private String practiceSuggestion;
        private String nextQuestionText;
        private Boolean isFinalQuestion;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class FinalEvaluationResponse {
        private Long sessionId;
        private Integer overallScore;
        private Integer technicalScore;
        private Integer communicationScore;
        private List<String> keyStrengths;
        private List<String> areasToImprove;
        private String summaryFeedback;
    }
}
