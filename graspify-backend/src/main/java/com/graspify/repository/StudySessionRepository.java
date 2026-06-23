package com.graspify.repository;

import com.graspify.model.StudySession;
import com.graspify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface StudySessionRepository extends JpaRepository<StudySession, UUID> {
    List<StudySession> findByUserOrderByStartTimeDesc(User user);
    List<StudySession> findByUserAndStartTimeBetweenOrderByStartTimeDesc(
        User user, LocalDateTime start, LocalDateTime end
    );
}
