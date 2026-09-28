package com.careerpilot.dto;

import com.careerpilot.domain.Application.ApplicationStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

public class ApplicationDTOs {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplicationDTO {
        private Long id;
        private Long userId;
        private String companyName;
        private String jobTitle;
        private String location;
        private String salaryRange;
        private ApplicationStatus status;
        private String appliedDate;
        private String followUpDate;
        private String contactPerson;
        private String notes;
        private String jdText;
    }
}
