package com.graspify.repository;

import com.graspify.model.Canvas;
import com.graspify.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface CanvasRepository extends JpaRepository<Canvas, UUID> {
    List<Canvas> findByUserAndDeletedFalseOrderByUpdatedAtDesc(User user);
    List<Canvas> findByUserAndDeletedTrueOrderByDeletedAtDesc(User user);
    List<Canvas> findByUserIdOrderByUpdatedAtDesc(UUID userId);
}