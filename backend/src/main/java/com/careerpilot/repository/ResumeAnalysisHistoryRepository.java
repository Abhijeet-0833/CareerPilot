package com.careerpilot.repository;

import com.careerpilot.domain.ResumeAnalysisHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ResumeAnalysisHistoryRepository extends JpaRepository<ResumeAnalysisHistory, Long> {
    List<ResumeAnalysisHistory> findByUserIdOrderByCreatedAtDesc(Long userId);
}
