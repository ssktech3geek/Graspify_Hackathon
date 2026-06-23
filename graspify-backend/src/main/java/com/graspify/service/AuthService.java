package com.graspify.service;

import com.graspify.model.User;
import com.graspify.repository.UserRepository;
import com.graspify.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final JwtService jwtService;

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
}