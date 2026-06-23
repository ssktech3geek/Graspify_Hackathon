package com.graspify.service;

import com.graspify.model.StudySession;
import com.graspify.model.User;
import com.graspify.repository.StudySessionRepository;
import com.graspify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class StudySessionService {

    private final StudySessionRepository sessionRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public StudySession startSession(String email, String subject) {
        User user = getUser(email);
        StudySession session = StudySession.builder()
                .user(user)
                .startTime(LocalDateTime.now())
                .subject(subject)
                .build();
        return sessionRepository.save(session);
    }

    public StudySession endSession(UUID id, String notes) {
        StudySession session = sessionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        session.setEndTime(LocalDateTime.now());
        session.setDurationMinutes(
            ChronoUnit.MINUTES.between(session.getStartTime(), session.getEndTime())
        );
        session.setNotes(notes);
        return sessionRepository.save(session);
    }

    public List<StudySession> getAllSessions(String email) {
        User user = getUser(email);
        return sessionRepository.findByUserOrderByStartTimeDesc(user);
    }

    public List<StudySession> getWeeklySessions(String email) {
        User user = getUser(email);
        LocalDateTime weekStart = LocalDateTime.now().minusDays(7);
        return sessionRepository.findByUserAndStartTimeBetweenOrderByStartTimeDesc(
            user, weekStart, LocalDateTime.now()
        );
    }
}