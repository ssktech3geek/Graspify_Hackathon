package com.graspify.controller;

import com.graspify.model.StudySession;
import com.graspify.service.StudySessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class StudySessionController {

    private final StudySessionService sessionService;

    @PostMapping("/start")
    public ResponseEntity<?> startSession(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        try {
            String subject = body.getOrDefault("subject", "General");
            StudySession session = sessionService.startSession(auth.getName(), subject);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/end")
    public ResponseEntity<?> endSession(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        try {
            String notes = body.getOrDefault("notes", "");
            StudySession session = sessionService.endSession(id, notes);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getAllSessions(Authentication auth) {
        try {
            List<StudySession> sessions = sessionService.getAllSessions(auth.getName());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/weekly")
    public ResponseEntity<?> getWeeklySessions(Authentication auth) {
        try {
            List<StudySession> sessions = sessionService.getWeeklySessions(auth.getName());
            return ResponseEntity.ok(sessions);
        } catch (Exception e) {
            return ResponseEntity.internalServerError().body(Map.of("error", e.getMessage()));
        }
    }
}