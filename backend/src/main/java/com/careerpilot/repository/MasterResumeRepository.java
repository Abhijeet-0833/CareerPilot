package com.careerpilot.repository;

import com.careerpilot.domain.MasterResume;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface MasterResumeRepository extends JpaRepository<MasterResume, Long> {
    Optional<MasterResume> findByUserId(Long userId);
}
