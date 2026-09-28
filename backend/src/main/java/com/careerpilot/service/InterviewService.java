package com.careerpilot.service;

import com.careerpilot.domain.InterviewSession;
import com.careerpilot.dto.InterviewDTOs.*;
import com.careerpilot.repository.InterviewSessionRepository;
import com.careerpilot.service.ai.AIProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class InterviewService {

    @Autowired
    private InterviewSessionRepository interviewSessionRepository;

    @Autowired
    private AIProvider aiProvider;

    public InterviewSession startSession(Long userId, InterviewStartRequest request) {
        InterviewSession session = InterviewSession.builder()
                .userId(userId)
                .interviewType(request.getInterviewType() != null ? request.getInterviewType() : "Java & Spring Boot")
                .targetRole(request.getTargetRole() != null ? request.getTargetRole() : "Java Developer")
                .overallScore(0)
                .isCompleted(false)
                .build();

        return interviewSessionRepository.save(session);
    }

    public AnswerEvaluation submitAnswer(Long userId, AnswerSubmitRequest request) {
        AnswerEvaluation eval = aiProvider.evaluateInterviewAnswer(
                "Java & Spring Boot",
                request.getQuestionText(),
                request.getUserAnswer(),
                request.getQuestionIndex() != null ? request.getQuestionIndex() : 0
        );

        if (request.getSessionId() != null) {
            InterviewSession session = interviewSessionRepository.findById(request.getSessionId()).orElse(null);
            if (session != null) {
                session.setOverallScore(eval.getScore());
                if (Boolean.TRUE.equals(eval.getIsFinalQuestion())) {
                    session.setIsCompleted(true);
                    session.setTechScore(eval.getScore());
                    session.setCommScore(eval.getScore() + 5);
                }
                interviewSessionRepository.save(session);
            }
        }

        return eval;
    }

    public FinalEvaluationResponse getFinalEvaluation(Long sessionId) {
        InterviewSession session = interviewSessionRepository.findById(sessionId).orElse(null);
        int score = session != null && session.getOverallScore() != null ? session.getOverallScore() : 85;

        return FinalEvaluationResponse.builder()
                .sessionId(sessionId)
                .overallScore(score)
                .technicalScore(score)
                .communicationScore(Math.min(98, score + 4))
                .keyStrengths(List.of("Strong technical vocabulary", "Clear Spring Security architecture explanation", "Solid understanding of SQL joins"))
                .areasToImprove(List.of("Reduce filler words like 'basically'", "Include explicit performance benchmarks in project answers"))
                .summaryFeedback("Solid interview overall. Technical accuracy is very good and answers demonstrate practical hands-on capability.")
                .build();
    }
}
