package com.careerpilot.repository;

import com.careerpilot.domain.User;
import com.careerpilot.domain.VerificationToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationToken, Long> {
    Optional<VerificationToken> findByToken(String token);
    List<VerificationToken> findByUser(User user);
    Optional<VerificationToken> findTopByUserOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
