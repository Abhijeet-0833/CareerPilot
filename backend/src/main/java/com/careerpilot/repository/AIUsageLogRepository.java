package com.careerpilot.repository;

import com.careerpilot.domain.AIUsageLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AIUsageLogRepository extends JpaRepository<AIUsageLog, Long> {
    List<AIUsageLog> findByUserId(Long userId);
}
