package com.graspify.service;

import com.graspify.model.Canvas;
import com.graspify.model.Panel;
import com.graspify.repository.PanelRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PanelService {

    private final PanelRepository panelRepository;
    private final CanvasService canvasService;

    public List<Panel> getPanelsForCanvas(UUID canvasId) {
        return panelRepository.findByCanvasIdOrderByOrderIndexAsc(canvasId);
    }

    public Panel createPanel(UUID canvasId, Panel.PanelType type, Double x, Double y,
                              Double width, Double height, String content, Integer orderIndex) {
        Canvas canvas = canvasService.getCanvasById(canvasId);

        Panel panel = Panel.builder()
                .canvas(canvas)
                .type(type)
                .positionX(x)
                .positionY(y)
                .width(width)
                .height(height)
                .content(content)
                .orderIndex(orderIndex)
                .build();

        return panelRepository.save(panel);
    }

    public Panel updatePanel(UUID id, Double x, Double y, Double width,
                              Double height, String content) {
        Panel panel = panelRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Panel not found"));

        if (x != null) panel.setPositionX(x);
        if (y != null) panel.setPositionY(y);
        if (width != null) panel.setWidth(width);
        if (height != null) panel.setHeight(height);
        if (content != null) panel.setContent(content);

        return panelRepository.save(panel);
    }

    public void deletePanel(UUID id) {
        panelRepository.deleteById(id);
    }
}