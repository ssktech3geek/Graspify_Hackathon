package com.graspify.controller;

import com.graspify.model.Panel;
import com.graspify.service.PanelService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class PanelController {

    private final PanelService panelService;

    @GetMapping("/api/canvases/{canvasId}/panels")
    public ResponseEntity<?> getPanels(@PathVariable UUID canvasId) {
        try {
            List<Panel> panels = panelService.getPanelsForCanvas(canvasId);
            return ResponseEntity.ok(panels);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/api/canvases/{canvasId}/panels")
    public ResponseEntity<?> createPanel(
            @PathVariable UUID canvasId,
            @RequestBody Map<String, Object> body) {
        try {
            Panel.PanelType type = Panel.PanelType.valueOf((String) body.get("type"));
            Double x = body.get("positionX") != null ? Double.valueOf(body.get("positionX").toString()) : 0.0;
            Double y = body.get("positionY") != null ? Double.valueOf(body.get("positionY").toString()) : 0.0;
            Double width = body.get("width") != null ? Double.valueOf(body.get("width").toString()) : 400.0;
            Double height = body.get("height") != null ? Double.valueOf(body.get("height").toString()) : 300.0;
            String content = (String) body.getOrDefault("content", "{}");
            Integer orderIndex = body.get("orderIndex") != null ? Integer.valueOf(body.get("orderIndex").toString()) : 0;

            Panel panel = panelService.createPanel(canvasId, type, x, y, width, height, content, orderIndex);
            return ResponseEntity.ok(panel);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/api/panels/{id}")
    public ResponseEntity<?> updatePanel(
            @PathVariable UUID id,
            @RequestBody Map<String, Object> body) {
        try {
            Double x = body.get("positionX") != null ? Double.valueOf(body.get("positionX").toString()) : null;
            Double y = body.get("positionY") != null ? Double.valueOf(body.get("positionY").toString()) : null;
            Double width = body.get("width") != null ? Double.valueOf(body.get("width").toString()) : null;
            Double height = body.get("height") != null ? Double.valueOf(body.get("height").toString()) : null;
            String content = (String) body.get("content");

            Panel panel = panelService.updatePanel(id, x, y, width, height, content);
            return ResponseEntity.ok(panel);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @DeleteMapping("/api/panels/{id}")
    public ResponseEntity<?> deletePanel(@PathVariable UUID id) {
        try {
            panelService.deletePanel(id);
            return ResponseEntity.ok(Map.of("message", "Panel deleted"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}