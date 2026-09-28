package com.careerpilot.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ProfileDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UserProfileDTO {
        private Long id;
        private Long userId;
        private String phone;
        private String location;
        private String preferredLocations;
        private Integer experienceYears;
        private String education;
        private String technicalSkills;
        private String softSkills;
        private String targetRole;
        private Double expectedSalary;
        private String workPreference;
        private String noticePeriod;
        private String linkedinUrl;
        private String githubUrl;
        private String portfolioUrl;
        private String summary;
    }
}
