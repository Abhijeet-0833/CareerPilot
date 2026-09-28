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

public interface AIProvider {
    ATSAnalysisResult analyzeResume(String rawText);
    TailoredResumeResult generateTailoredResume(MasterResume masterResume, JobDescription job);
    JDAnalysisResponse analyzeJD(String rawJdText, String title, String company);
    JobMatchResponse matchJob(UserProfile profile, MasterResume resume, JobDescription job);
    RoadmapResponse generateLearningRoadmap(UserProfile profile, MasterResume resume);
    AnswerEvaluation evaluateInterviewAnswer(String interviewType, String questionText, String userAnswer, int questionIndex);
    String generateOutreachMessage(UserProfile profile, JobDescription job, String type);
    String chatCareerCoach(UserProfile profile, MasterResume resume, String userMessage);
}
