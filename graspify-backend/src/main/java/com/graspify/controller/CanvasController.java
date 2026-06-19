package com.graspify.controller;

import com.graspify.model.Canvas;
import com.graspify.service.CanvasService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/canvases")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class CanvasController {

    private final CanvasService canvasService;

    @GetMapping
    public ResponseEntity<?> getCanvases(Authentication auth) {
        try {
            String email = auth.getName();
            List<Canvas> canvases = canvasService.getUserCanvases(email);
            return ResponseEntity.ok(canvases);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/deleted")
    public ResponseEntity<?> getDeletedCanvases(Authentication auth) {
        try {
            String email = auth.getName();
            List<Canvas> canvases = canvasService.getDeletedCanvases(email);
            return ResponseEntity.ok(canvases);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping
    public ResponseEntity<?> createCanvas(
            Authentication auth,
            @RequestBody Map<String, String> body) {
        try {
            String email = auth.getName();
            String title = body.getOrDefault("title", "Untitled Canvas");
            String subject = body.get("subject");

            Canvas canvas = canvasService.createCanvas(email, title, subject);
            return ResponseEntity.ok(canvas);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getCanvas(@PathVariable UUID id) {
        try {
            Canvas canvas = canvasService.getCanvasById(id);
            return ResponseEntity.ok(canvas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateCanvas(
            @PathVariable UUID id,
            @RequestBody Map<String, String> body) {
        try {
            Canvas canvas = canvasService.updateCanvas(
                    id, body.get("title"), body.get("subject"));
            return ResponseEntity.ok(canvas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCanvas(@PathVariable UUID id) {
        try {
            canvasService.softDeleteCanvas(id);
            return ResponseEntity.ok(Map.of("message", "Canvas moved to deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/{id}/restore")
    public ResponseEntity<?> restoreCanvas(@PathVariable UUID id) {
        try {
            Canvas canvas = canvasService.restoreCanvas(id);
            return ResponseEntity.ok(canvas);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}