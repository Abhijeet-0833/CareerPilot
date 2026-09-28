package com.careerpilot.service;

import com.careerpilot.domain.Application;
import com.careerpilot.domain.Application.ApplicationStatus;
import com.careerpilot.dto.ApplicationDTOs.ApplicationDTO;
import com.careerpilot.repository.ApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ApplicationTrackerService {

    @Autowired
    private ApplicationRepository applicationRepository;

    @Autowired
    private NotificationService notificationService;

    public List<ApplicationDTO> getUserApplications(Long userId) {
        List<Application> apps = applicationRepository.findByUserId(userId);

        if (apps.isEmpty()) {
            // Seed initial sample tracking items for new candidates
            Application a1 = applicationRepository.save(Application.builder()
                    .userId(userId)
                    .companyName("Stripe")
                    .jobTitle("Senior Java Backend Engineer")
                    .location("San Francisco, CA")
                    .salaryRange("$140,000 - $180,000")
                    .status(ApplicationStatus.INTERVIEW)
                    .appliedDate("2026-09-15")
                    .followUpDate("2026-09-28")
                    .contactPerson("Sarah Miller (Tech Recruiter)")
                    .notes("Technical system design round scheduled for next Monday.")
                    .build());

            Application a2 = applicationRepository.save(Application.builder()
                    .userId(userId)
                    .companyName("Datadog")
                    .jobTitle("Full Stack Software Engineer")
                    .location("Remote")
                    .salaryRange("$130,000 - $160,000")
                    .status(ApplicationStatus.APPLIED)
                    .appliedDate("2026-09-20")
                    .followUpDate("2026-09-30")
                    .notes("Applied with tailored Master Resume.")
                    .build());

            Application a3 = applicationRepository.save(Application.builder()
                    .userId(userId)
                    .companyName("Linear")
                    .jobTitle("Product Engineer")
                    .location("Remote")
                    .salaryRange("$150,000 - $190,000")
                    .status(ApplicationStatus.SAVED)
                    .appliedDate("2026-09-22")
                    .notes("High match score 92%! Tailoring resume now.")
                    .build());

            apps = List.of(a1, a2, a3);
        }

        return apps.stream().map(this::mapToDTO).collect(Collectors.toList());
    }

    public ApplicationDTO createApplication(Long userId, ApplicationDTO dto) {
        Application app = Application.builder()
                .userId(userId)
                .companyName(dto.getCompanyName())
                .jobTitle(dto.getJobTitle())
                .location(dto.getLocation())
                .salaryRange(dto.getSalaryRange())
                .status(dto.getStatus() != null ? dto.getStatus() : ApplicationStatus.SAVED)
                .appliedDate(dto.getAppliedDate())
                .followUpDate(dto.getFollowUpDate())
                .contactPerson(dto.getContactPerson())
                .notes(dto.getNotes())
                .jdText(dto.getJdText())
                .build();

        Application saved = applicationRepository.save(app);
        return mapToDTO(saved);
    }

    public ApplicationDTO updateStatus(Long userId, Long appId, ApplicationStatus status) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + appId));

        if (!app.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You do not own this application.");
        }

        ApplicationStatus oldStatus = app.getStatus();
        app.setStatus(status);
        Application updated = applicationRepository.save(app);

        // Notify user on milestone stage updates
        if (oldStatus != status) {
            notificationService.createNotification(
                    userId,
                    "APPLICATION_STATUS_CHANGED",
                    "Application Update: " + app.getCompanyName(),
                    "Application status for " + app.getJobTitle() + " at " + app.getCompanyName() + " moved to " + status,
                    "/applications"
            );
        }

        return mapToDTO(updated);
    }

    public void deleteApplication(Long userId, Long appId) {
        Application app = applicationRepository.findById(appId)
                .orElseThrow(() -> new RuntimeException("Application not found with id: " + appId));

        if (!app.getUserId().equals(userId)) {
            throw new RuntimeException("Access denied: You do not own this application.");
        }

        applicationRepository.delete(app);
    }

    private ApplicationDTO mapToDTO(Application app) {
        return ApplicationDTO.builder()
                .id(app.getId())
                .userId(app.getUserId())
                .companyName(app.getCompanyName())
                .jobTitle(app.getJobTitle())
                .location(app.getLocation())
                .salaryRange(app.getSalaryRange())
                .status(app.getStatus())
                .appliedDate(app.getAppliedDate())
                .followUpDate(app.getFollowUpDate())
                .contactPerson(app.getContactPerson())
                .notes(app.getNotes())
                .jdText(app.getJdText())
                .build();
    }
}
