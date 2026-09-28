package com.careerpilot.service;

import com.careerpilot.domain.JobDescription;
import com.careerpilot.domain.JobMatch;
import com.careerpilot.domain.MasterResume;
import com.careerpilot.domain.UserProfile;
import com.careerpilot.dto.JobDTOs.*;
import com.careerpilot.repository.JobDescriptionRepository;
import com.careerpilot.repository.JobMatchRepository;
import com.careerpilot.repository.MasterResumeRepository;
import com.careerpilot.repository.UserProfileRepository;
import com.careerpilot.service.ai.AIProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class JobAnalysisService {

    @Autowired
    private JobDescriptionRepository jobDescriptionRepository;

    @Autowired
    private JobMatchRepository jobMatchRepository;

    @Autowired
    private UserProfileRepository userProfileRepository;

    @Autowired
    private MasterResumeRepository masterResumeRepository;

    @Autowired
    private AIProvider aiProvider;

    public JDAnalysisResponse analyzeJD(JDAnalysisRequest request) {
        JDAnalysisResponse response = aiProvider.analyzeJD(request.getRawJdText(), request.getJobTitle(), request.getCompanyName());

        JobDescription jd = JobDescription.builder()
                .jobTitle(response.getJobTitle())
                .companyName(response.getCompanyName())
                .location(response.getLocation())
                .experienceRequired(response.getExperienceRequired())
                .salaryRange(response.getSalaryRange())
                .rawJdText(request.getRawJdText())
                .build();

        JobDescription saved = jobDescriptionRepository.save(jd);
        response.setJobId(saved.getId());

        return response;
    }

    public JobMatchResponse matchJob(Long userId, Long jobId) {
        UserProfile profile = userProfileRepository.findByUserId(userId).orElse(null);
        MasterResume resume = masterResumeRepository.findByUserId(userId).orElse(null);
        JobDescription job = jobDescriptionRepository.findById(jobId).orElse(null);

        JobMatchResponse response = aiProvider.matchJob(profile, resume, job);

        JobMatch match = JobMatch.builder()
                .userId(userId)
                .jobId(jobId)
                .matchScore(response.getMatchScore())
                .readinessScore(response.getReadinessScore())
                .techSkillsMatch(response.getTechSkillsMatch())
                .experienceMatch(response.getExperienceMatch())
                .educationMatch(response.getEducationMatch())
                .projectsMatch(response.getProjectsMatch())
                .keywordsMatch(response.getKeywordsMatch())
                .build();

        JobMatch saved = jobMatchRepository.save(match);
        response.setMatchId(saved.getId());

        return response;
    }

    public MarketSkillAnalytics getMarketSkillAnalytics(String targetRole) {
        String role = targetRole != null ? targetRole : "Java Full Stack Developer";
        
        Map<String, Integer> demand = new HashMap<>();
        demand.put("Spring Boot 3", 88);
        demand.put("SQL / PostgreSQL", 84);
        demand.put("REST API Architecture", 81);
        demand.put("Docker & Containers", 62);
        demand.put("AWS Cloud", 58);
        demand.put("Kafka Messaging", 45);
        demand.put("React & TypeScript", 72);

        return MarketSkillAnalytics.builder()
                .targetRole(role)
                .totalJDsAnalyzed(125)
                .topSkillsDemand(demand)
                .highDemandKeywords(List.of("Spring Boot", "Microservices", "REST API", "SQL", "Docker", "AWS", "Kafka", "JUnit"))
                .build();
    }
}
