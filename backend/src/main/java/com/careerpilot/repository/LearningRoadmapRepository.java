package com.careerpilot.repository;

import com.careerpilot.domain.LearningRoadmap;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LearningRoadmapRepository extends JpaRepository<LearningRoadmap, Long> {
    Optional<LearningRoadmap> findByUserId(Long userId);
}
