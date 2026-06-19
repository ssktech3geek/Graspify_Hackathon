package com.graspify.controller;

import com.graspify.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiService aiService;

    @PostMapping("/ask")
    public ResponseEntity<?> ask(@RequestBody Map<String, String> body) {
        try {
            String question = body.get("question");
            String context = body.getOrDefault("context", "");

            if (question == null || question.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Question is required"));
            }

            String answer = aiService.askGroq(question, context);
            return ResponseEntity.ok(Map.of("answer", answer));

        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}
