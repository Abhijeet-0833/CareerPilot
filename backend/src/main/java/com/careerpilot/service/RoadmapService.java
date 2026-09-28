package com.careerpilot.service;

import com.careerpilot.domain.LearningRoadmap;
import com.careerpilot.domain.MasterResume;
import com.careerpilot.domain.UserProfile;
import com.careerpilot.dto.RoadmapDTOs.RoadmapResponse;
import com.careerpilot.repository.LearningRoadmapRepository;
import com.careerpilot.repository.MasterResumeRepository;
import com.careerpilot.repository.UserProfileRepository;
import com.careerpilot.service.ai.AIProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class RoadmapService {

    @Autowired
    private LearningRoadmapRepository roadmapRepository;

    @Autowired
    private UserProfileRepository profileRepository;

    @Autowired
    private MasterResumeRepository resumeRepository;

    @Autowired
    private AIProvider aiProvider;

    public RoadmapResponse getOrGenerateRoadmap(Long userId) {
        UserProfile profile = profileRepository.findByUserId(userId).orElse(null);
        MasterResume resume = resumeRepository.findByUserId(userId).orElse(null);

        RoadmapResponse response = aiProvider.generateLearningRoadmap(profile, resume);

        LearningRoadmap roadmap = roadmapRepository.findByUserId(userId)
                .orElse(LearningRoadmap.builder()
                        .userId(userId)
                        .targetRole(response.getTargetRole())
                        .durationWeeks(response.getDurationWeeks())
                        .progressPercent(response.getProgressPercent())
                        .build());

        roadmapRepository.save(roadmap);

        return response;
    }
}
