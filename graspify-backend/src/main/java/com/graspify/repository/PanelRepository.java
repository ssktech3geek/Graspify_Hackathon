package com.graspify.repository;

import com.graspify.model.Panel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface PanelRepository extends JpaRepository<Panel, UUID> {
    List<Panel> findByCanvasIdOrderByOrderIndexAsc(UUID canvasId);
    void deleteByCanvasId(UUID canvasId);
}