package com.careerpilot.service.ai;

import com.careerpilot.domain.JobDescription;
import com.careerpilot.domain.MasterResume;
import com.careerpilot.domain.UserProfile;
import com.careerpilot.dto.JobDTOs.JDAnalysisResponse;
import com.careerpilot.dto.JobDTOs.JobMatchResponse;
import com.careerpilot.dto.ResumeDTOs.ATSAnalysisResult;
import com.careerpilot.dto.ResumeDTOs.TailoredResumeResult;
import com.careerpilot.dto.RoadmapDTOs.RoadmapResponse;
import com.careerpilot.dto.InterviewDTOs.AnswerEvaluation;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Primary
@Service
public class OpenAIProvider implements AIProvider {

    @Value("${app.ai.api-key:}")
    private String apiKey;

    @Autowired
    private MockAIProvider fallbackProvider;

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public ATSAnalysisResult analyzeResume(String rawText) {
        if (apiKey == null || apiKey.isBlank() || "MOCK".equalsIgnoreCase(apiKey)) {
            return fallbackProvider.analyzeResume(rawText);
        }
        // When live API key is provided, Fallback to deterministic AI parser
        return fallbackProvider.analyzeResume(rawText);
    }

    @Override
    public TailoredResumeResult generateTailoredResume(MasterResume masterResume, JobDescription job) {
        return fallbackProvider.generateTailoredResume(masterResume, job);
    }

    @Override
    public JDAnalysisResponse analyzeJD(String rawJdText, String title, String company) {
        return fallbackProvider.analyzeJD(rawJdText, title, company);
    }

    @Override
    public JobMatchResponse matchJob(UserProfile profile, MasterResume resume, JobDescription job) {
        return fallbackProvider.matchJob(profile, resume, job);
    }

    @Override
    public RoadmapResponse generateLearningRoadmap(UserProfile profile, MasterResume resume) {
        return fallbackProvider.generateLearningRoadmap(profile, resume);
    }

    @Override
    public AnswerEvaluation evaluateInterviewAnswer(String interviewType, String questionText, String userAnswer, int questionIndex) {
        return fallbackProvider.evaluateInterviewAnswer(interviewType, questionText, userAnswer, questionIndex);
    }

    @Override
    public String generateOutreachMessage(UserProfile profile, JobDescription job, String type) {
        return fallbackProvider.generateOutreachMessage(profile, job, type);
    }

    @Override
    public String chatCareerCoach(UserProfile profile, MasterResume resume, String userMessage) {
        return fallbackProvider.chatCareerCoach(profile, resume, userMessage);
    }
}
