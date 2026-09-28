package com.careerpilot.service;

import com.careerpilot.domain.Application;
import com.careerpilot.domain.Application.ApplicationStatus;
import com.careerpilot.dto.ApplicationDTOs.ApplicationDTO;
import com.careerpilot.repository.ApplicationRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ApplicationTrackerServiceTest {

    @Mock
    private ApplicationRepository applicationRepository;

    @Mock
    private NotificationService notificationService;

    @InjectMocks
    private ApplicationTrackerService applicationTrackerService;

    @Test
    void createApplication_Success() {
        ApplicationDTO dto = ApplicationDTO.builder()
                .companyName("Datadog")
                .jobTitle("Full Stack Engineer")
                .status(ApplicationStatus.SAVED)
                .build();

        Application savedApp = Application.builder()
                .id(20L)
                .userId(1L)
                .companyName("Datadog")
                .jobTitle("Full Stack Engineer")
                .status(ApplicationStatus.SAVED)
                .build();

        when(applicationRepository.save(any(Application.class))).thenReturn(savedApp);

        ApplicationDTO result = applicationTrackerService.createApplication(1L, dto);

        assertNotNull(result);
        assertEquals(20L, result.getId());
        assertEquals("Datadog", result.getCompanyName());
    }

    @Test
    void updateStatus_Success() {
        Application app = Application.builder()
                .id(20L)
                .userId(1L)
                .companyName("Datadog")
                .jobTitle("Engineer")
                .status(ApplicationStatus.SAVED)
                .build();

        when(applicationRepository.findById(20L)).thenReturn(Optional.of(app));
        when(applicationRepository.save(any(Application.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ApplicationDTO updated = applicationTrackerService.updateStatus(1L, 20L, ApplicationStatus.INTERVIEW);

        assertNotNull(updated);
        assertEquals(ApplicationStatus.INTERVIEW, updated.getStatus());
    }
}
