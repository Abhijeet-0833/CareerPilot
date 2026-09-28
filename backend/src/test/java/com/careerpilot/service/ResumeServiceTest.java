package com.careerpilot.service;

import com.careerpilot.domain.MasterResume;
import com.careerpilot.dto.ResumeDTOs.*;
import com.careerpilot.repository.JobDescriptionRepository;
import com.careerpilot.repository.MasterResumeRepository;
import com.careerpilot.service.ai.AIProvider;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ResumeServiceTest {

    @Mock
    private MasterResumeRepository masterResumeRepository;

    @Mock
    private JobDescriptionRepository jobDescriptionRepository;

    @Mock
    private AIProvider aiProvider;

    @InjectMocks
    private ResumeService resumeService;

    @Test
    void uploadAndAnalyzeResume_Success() {
        ResumeUploadRequest request = ResumeUploadRequest.builder()
                .fileName("resume.pdf")
                .rawText("Java 17 Spring Boot REST API SQL")
                .build();

        ATSAnalysisResult mockResult = ATSAnalysisResult.builder()
                .overallAtsScore(85)
                .keywordsScore(88)
                .skillsScore(82)
                .detectedSkills(List.of("Java", "Spring Boot"))
                .build();

        when(masterResumeRepository.findByUserId(1L)).thenReturn(Optional.empty());
        when(aiProvider.analyzeResume(anyString())).thenReturn(mockResult);

        MasterResume savedResume = MasterResume.builder().id(10L).userId(1L).build();
        when(masterResumeRepository.save(any(MasterResume.class))).thenReturn(savedResume);

        ATSAnalysisResult result = resumeService.uploadAndAnalyzeResume(1L, request);

        assertNotNull(result);
        assertEquals(85, result.getOverallAtsScore());
        assertEquals(10L, result.getResumeId());
        verify(masterResumeRepository, times(1)).save(any(MasterResume.class));
    }
}
