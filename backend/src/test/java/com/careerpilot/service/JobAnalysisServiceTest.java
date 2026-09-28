package com.careerpilot.service;

import com.careerpilot.domain.JobDescription;
import com.careerpilot.dto.JobDTOs.*;
import com.careerpilot.repository.JobDescriptionRepository;
import com.careerpilot.repository.JobMatchRepository;
import com.careerpilot.repository.MasterResumeRepository;
import com.careerpilot.repository.UserProfileRepository;
import com.careerpilot.service.ai.AIProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class JobAnalysisServiceTest {

    @Mock
    private JobDescriptionRepository jobDescriptionRepository;

    @Mock
    private JobMatchRepository jobMatchRepository;

    @Mock
    private UserProfileRepository userProfileRepository;

    @Mock
    private MasterResumeRepository masterResumeRepository;

    @Mock
    private AIProvider aiProvider;

    @InjectMocks
    private JobAnalysisService jobAnalysisService;

    @Test
    void analyzeJD_Success() {
        JDAnalysisRequest request = JDAnalysisRequest.builder()
                .jobTitle("Java Backend Engineer")
                .companyName("Stripe")
                .rawJdText("Requires Java 17, Spring Boot, REST API, SQL")
                .build();

        JDAnalysisResponse aiResponse = JDAnalysisResponse.builder()
                .jobTitle("Java Backend Engineer")
                .companyName("Stripe")
                .mustHaveSkills(List.of("Java 17", "Spring Boot"))
                .build();

        when(aiProvider.analyzeJD(anyString(), anyString(), anyString())).thenReturn(aiResponse);

        JobDescription savedJd = JobDescription.builder().id(50L).jobTitle("Java Backend Engineer").build();
        when(jobDescriptionRepository.save(any(JobDescription.class))).thenReturn(savedJd);

        JDAnalysisResponse response = jobAnalysisService.analyzeJD(request);

        assertNotNull(response);
        assertEquals(50L, response.getJobId());
        assertEquals("Stripe", response.getCompanyName());
    }
}
