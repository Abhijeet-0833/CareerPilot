package com.careerpilot.repository;

import com.careerpilot.domain.JobDescription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface JobDescriptionRepository extends JpaRepository<JobDescription, Long> {
    List<JobDescription> findByJobTitleContainingIgnoreCase(String jobTitle);
}
