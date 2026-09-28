package com.careerpilot.repository;

import com.careerpilot.domain.Application;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {
    List<Application> findByUserId(Long userId);
    List<Application> findByUserIdAndStatus(Long userId, Application.ApplicationStatus status);
}
