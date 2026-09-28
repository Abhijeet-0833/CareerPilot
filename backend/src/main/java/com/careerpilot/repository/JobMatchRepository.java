package com.careerpilot.repository;

import com.careerpilot.domain.JobMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {
    List<JobMatch> findByUserId(Long userId);
    Optional<JobMatch> findByUserIdAndJobId(Long userId, Long jobId);
}
