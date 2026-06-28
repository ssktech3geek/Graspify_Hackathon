package com.graspify.controller;

import com.graspify.service.SubscriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/subscription")
@CrossOrigin(origins = "http://localhost:5173")
public class SubscriptionController {

    @Autowired
    private SubscriptionService subscriptionService;

    @GetMapping("/plans")
    public ResponseEntity<Map<String, Object>> getSubscriptionPlans() {
        return ResponseEntity.ok(subscriptionService.getAllSubscriptionPlans());
    }

    @PostMapping("/upgrade")
    public ResponseEntity<String> upgradeSubscription(@RequestBody Map<String, String> request) {
        // TODO: Implement payment integration and subscription upgrade logic
        String planType = request.get("planType");
        return ResponseEntity.ok("Subscription upgrade to " + planType + " initiated");
    }
}
