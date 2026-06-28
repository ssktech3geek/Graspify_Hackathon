package com.graspify.service;

import com.graspify.model.SubscriptionType;
import org.springframework.stereotype.Service;

import java.util.Map;

@Service
public class SubscriptionService {

    public Map<String, Object> getAllSubscriptionPlans() {
        return Map.of(
                "GUEST", Map.of(
                        "canvasLimit", SubscriptionType.GUEST.getCanvasLimit(),
                        "aiSpeedMultiplier", SubscriptionType.GUEST.getAiSpeedMultiplier(),
                        "priceInRupees", SubscriptionType.GUEST.getPriceInRupees(),
                        "description", SubscriptionType.GUEST.getDescription()
                ),
                "FREE", Map.of(
                        "canvasLimit", SubscriptionType.FREE.getCanvasLimit(),
                        "aiSpeedMultiplier", SubscriptionType.FREE.getAiSpeedMultiplier(),
                        "priceInRupees", SubscriptionType.FREE.getPriceInRupees(),
                        "description", SubscriptionType.FREE.getDescription()
                ),
                "SILVER", Map.of(
                        "canvasLimit", SubscriptionType.SILVER.getCanvasLimit(),
                        "aiSpeedMultiplier", SubscriptionType.SILVER.getAiSpeedMultiplier(),
                        "priceInRupees", SubscriptionType.SILVER.getPriceInRupees(),
                        "description", SubscriptionType.SILVER.getDescription()
                ),
                "GOLD", Map.of(
                        "canvasLimit", SubscriptionType.GOLD.getCanvasLimit(),
                        "aiSpeedMultiplier", SubscriptionType.GOLD.getAiSpeedMultiplier(),
                        "priceInRupees", SubscriptionType.GOLD.getPriceInRupees(),
                        "description", SubscriptionType.GOLD.getDescription()
                ),
                "DIAMOND", Map.of(
                        "canvasLimit", SubscriptionType.DIAMOND.getCanvasLimit(),
                        "aiSpeedMultiplier", SubscriptionType.DIAMOND.getAiSpeedMultiplier(),
                        "priceInRupees", SubscriptionType.DIAMOND.getPriceInRupees(),
                        "description", SubscriptionType.DIAMOND.getDescription()
                )
        );
    }
}
