package com.graspify.model;

public enum SubscriptionType {
    GUEST(2, 1, 0, "Guest - Limited Access"),
    FREE(5, 1, 0, "Free - Basic Access"),
    SILVER(15, 2, 199, "Silver - Enhanced Access"),
    GOLD(50, 3, 499, "Gold - Premium Access"),
    DIAMOND(Integer.MAX_VALUE, 4, 999, "Diamond - Unlimited Access");

    private final int canvasLimit;
    private final int aiSpeedMultiplier;
    private final int priceInRupees;
    private final String description;

    SubscriptionType(int canvasLimit, int aiSpeedMultiplier, int priceInRupees, String description) {
        this.canvasLimit = canvasLimit;
        this.aiSpeedMultiplier = aiSpeedMultiplier;
        this.priceInRupees = priceInRupees;
        this.description = description;
    }

    public int getCanvasLimit() {
        return canvasLimit;
    }

    public int getAiSpeedMultiplier() {
        return aiSpeedMultiplier;
    }

    public int getPriceInRupees() {
        return priceInRupees;
    }

    public String getDescription() {
        return description;
    }
}
