package com.graspify.service;

import com.graspify.model.User;
import com.graspify.repository.UserRepository;
import com.graspify.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;

    public String loginWithGoogle(String email, String name, String avatarUrl) {
        User user = userRepository.findByEmail(email)
                .orElseGet(() -> {
                    User newUser = User.builder()
                            .email(email)
                            .name(name)
                            .avatarUrl(avatarUrl)
                            .authProvider(User.AuthProvider.GOOGLE)
                            .build();
                    return userRepository.save(newUser);
                });

        return jwtService.generateToken(user.getEmail(), user.getId(), "USER");
    }

    public String loginAsGuest() {
        String guestEmail = "guest_" + UUID.randomUUID() + "@graspify.guest";
        String guestName = "Guest User";

        User guestUser = User.builder()
                .email(guestEmail)
                .name(guestName)
                .authProvider(User.AuthProvider.GUEST)
                .build();

        userRepository.save(guestUser);

        return jwtService.generateToken(
                guestUser.getEmail(),
                guestUser.getId(),
                "GUEST"
        );
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public String signup(String name, String email, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        String encodedPassword = passwordEncoder.encode(password);
        
        User newUser = User.builder()
                .email(email)
                .name(name)
                .userPass(encodedPassword)
                .authProvider(User.AuthProvider.LOCAL)
                .build();

        userRepository.save(newUser);

        return jwtService.generateToken(newUser.getEmail(), newUser.getId(), "USER");
    }

    public String login(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email or password"));

        if (user.getAuthProvider() != User.AuthProvider.LOCAL) {
            throw new RuntimeException("Please use " + user.getAuthProvider().name() + " login");
        }

        if (!passwordEncoder.matches(password, user.getUserPass())) {
            throw new RuntimeException("Invalid email or password");
        }

        return jwtService.generateToken(user.getEmail(), user.getId(), "USER");
    }

    public String getEmailFromToken(String token) {
        return jwtService.extractEmail(token);
    }

    public User updateUserProfile(String email, String name, String avatarUrl) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (name != null && !name.isEmpty()) {
            user.setName(name);
        }
        if (avatarUrl != null && !avatarUrl.isEmpty()) {
            user.setAvatarUrl(avatarUrl);
        }
        
        return userRepository.save(user);
    }
}