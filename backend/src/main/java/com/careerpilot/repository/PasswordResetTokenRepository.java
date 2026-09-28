package com.careerpilot.repository;

import com.careerpilot.domain.PasswordResetToken;
import com.careerpilot.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PasswordResetTokenRepository extends JpaRepository<PasswordResetToken, Long> {
    Optional<PasswordResetToken> findByToken(String token);
    List<PasswordResetToken> findByUser(User user);
    Optional<PasswordResetToken> findTopByUserOrderByCreatedAtDesc(User user);
    void deleteByUser(User user);
}
