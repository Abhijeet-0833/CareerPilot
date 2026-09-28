package com.careerpilot.repository;

import com.careerpilot.domain.OtpToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface OtpTokenRepository extends JpaRepository<OtpToken, Long> {
    Optional<OtpToken> findTopByEmailOrderByCreatedAtDesc(String email);
    void deleteByEmail(String email);
}
