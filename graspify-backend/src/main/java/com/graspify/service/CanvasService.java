package com.graspify.service;

import com.graspify.model.Canvas;
import com.graspify.model.User;
import com.graspify.repository.CanvasRepository;
import com.graspify.repository.PanelRepository;
import com.graspify.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CanvasService {

    private final CanvasRepository canvasRepository;
    private final UserRepository userRepository;
    private final PanelRepository panelRepository;

    public List<Canvas> getUserCanvases(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return canvasRepository.findByUserAndDeletedFalseOrderByUpdatedAtDesc(user);
    }

    public List<Canvas> getDeletedCanvases(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return canvasRepository.findByUserAndDeletedTrueOrderByDeletedAtDesc(user);
    }

    public Canvas createCanvas(String email, String title, String subject) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Canvas canvas = Canvas.builder()
                .user(user)
                .title(title)
                .subject(subject)
                .build();

        return canvasRepository.save(canvas);
    }

    public Canvas getCanvasById(UUID id) {
        return canvasRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Canvas not found"));
    }

    public Canvas updateCanvas(UUID id, String title, String subject) {
        Canvas canvas = getCanvasById(id);
        if (title != null) canvas.setTitle(title);
        if (subject != null) canvas.setSubject(subject);
        return canvasRepository.save(canvas);
    }

    public void softDeleteCanvas(UUID id) {
        Canvas canvas = getCanvasById(id);
        canvas.setDeleted(true);
        canvas.setDeletedAt(LocalDateTime.now());
        canvasRepository.save(canvas);
    }

    public Canvas restoreCanvas(UUID id) {
        Canvas canvas = getCanvasById(id);
        canvas.setDeleted(false);
        canvas.setDeletedAt(null);
        canvasRepository.save(canvas);
        return canvas;
    }

    public void permanentDeleteCanvas(UUID id) {
        try {
            Canvas canvas = getCanvasById(id);
            panelRepository.deleteByCanvasId(id);
            canvasRepository.delete(canvas);
        } catch (RuntimeException e) {
            if (e.getMessage().contains("Canvas not found")) {
                // Canvas already deleted, ignore
                return;
            }
            throw e;
        }
    }
}