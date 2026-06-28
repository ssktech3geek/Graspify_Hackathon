package com.graspify.controller;

import com.graspify.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService = null;

    @PostMapping("/google")
    public ResponseEntity<?> googleLogin(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String name = body.get("name");
            String avatarUrl = body.get("avatarUrl");

            if (email == null || email.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email is required"));
            }

            String token = authService.loginWithGoogle(email, name, avatarUrl);

            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/guest")
    public ResponseEntity<?> guestLogin() {
        try {
            String token = authService.loginAsGuest();
            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Guest login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody Map<String, String> body) {
        try {
            String name = body.get("name");
            String email = body.get("email");
            String password = body.get("password");

            if (name == null || name.isEmpty() || email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "All fields are required"));
            }

            String token = authService.signup(name, email, password);

            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Signup successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email = body.get("email");
            String password = body.get("password");

            if (email == null || email.isEmpty() || password == null || password.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Email and password are required"));
            }

            String token = authService.login(email, password);

            return ResponseEntity.ok(Map.of(
                "token", token,
                "message", "Login successful"
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader("Authorization") String authHeader) {
        try {
            String token = authHeader.substring(7);
            return ResponseEntity.ok(Map.of("message", "Token valid"));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(
            @RequestHeader("Authorization") String authHeader, Map<String, Object> of) {
        try {
            String email = authService.getEmailFromToken(authHeader.substring(7));
            var user = authService.getUserByEmail(email);
            return ResponseEntity.ok(of);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, String> body, String avatarUrl2, Map<String, String> of) {
        try {
            String email = authService.getEmailFromToken(authHeader.substring(7));
            String name = body.get("name");
            String avatarUrl = body.get("avatarUrl");
            
            var user = authService.updateUserProfile(email, name, avatarUrl);
            return ResponseEntity.ok(of);
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PostMapping("/profile/avatar")
    public ResponseEntity<?> uploadAvatar(
            @RequestHeader("Authorization") String authHeader,
            @RequestParam("file") org.springframework.web.multipart.MultipartFile file, String avatarUrl) {
        try {
            String email = authService.getEmailFromToken(authHeader.substring(7));
            
            // Convert file to base64
            byte[] bytes = file.getBytes();
            String base64 = java.util.Base64.getEncoder().encodeToString(bytes);
            String dataUrl = "data:" + file.getContentType() + ";base64," + base64;
            
            var user = authService.updateUserProfile(email, null, dataUrl);
            return ResponseEntity.ok(Map.of(
                "avatarUrl", avatarUrl
            ));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", e.getMessage()));
        }
    }
}