package com.careerpilot.service;

import com.careerpilot.domain.UserProfile;
import com.careerpilot.dto.ProfileDTOs.UserProfileDTO;
import com.careerpilot.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserProfileRepository userProfileRepository;

    public UserProfileDTO getProfileByUserId(Long userId) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElseGet(() -> userProfileRepository.save(UserProfile.builder().userId(userId).build()));
        return mapToDTO(profile);
    }

    public UserProfileDTO updateProfile(Long userId, UserProfileDTO dto) {
        UserProfile profile = userProfileRepository.findByUserId(userId)
                .orElse(UserProfile.builder().userId(userId).build());

        profile.setPhone(dto.getPhone());
        profile.setLocation(dto.getLocation());
        profile.setPreferredLocations(dto.getPreferredLocations());
        profile.setExperienceYears(dto.getExperienceYears());
        profile.setEducation(dto.getEducation());
        profile.setTechnicalSkills(dto.getTechnicalSkills());
        profile.setSoftSkills(dto.getSoftSkills());
        profile.setTargetRole(dto.getTargetRole());
        profile.setExpectedSalary(dto.getExpectedSalary());
        profile.setWorkPreference(dto.getWorkPreference());
        profile.setNoticePeriod(dto.getNoticePeriod());
        profile.setLinkedinUrl(dto.getLinkedinUrl());
        profile.setGithubUrl(dto.getGithubUrl());
        profile.setPortfolioUrl(dto.getPortfolioUrl());
        profile.setSummary(dto.getSummary());

        UserProfile updated = userProfileRepository.save(profile);
        return mapToDTO(updated);
    }

    private UserProfileDTO mapToDTO(UserProfile profile) {
        return UserProfileDTO.builder()
                .id(profile.getId())
                .userId(profile.getUserId())
                .phone(profile.getPhone())
                .location(profile.getLocation())
                .preferredLocations(profile.getPreferredLocations())
                .experienceYears(profile.getExperienceYears())
                .education(profile.getEducation())
                .technicalSkills(profile.getTechnicalSkills())
                .softSkills(profile.getSoftSkills())
                .targetRole(profile.getTargetRole())
                .expectedSalary(profile.getExpectedSalary())
                .workPreference(profile.getWorkPreference())
                .noticePeriod(profile.getNoticePeriod())
                .linkedinUrl(profile.getLinkedinUrl())
                .githubUrl(profile.getGithubUrl())
                .portfolioUrl(profile.getPortfolioUrl())
                .summary(profile.getSummary())
                .build();
    }
}
