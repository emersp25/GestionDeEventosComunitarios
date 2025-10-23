package com.eventos.infrastructure.config;

import com.eventos.domain.model.Role;
import com.eventos.domain.model.User;
import com.eventos.domain.port.out.PasswordEncoderPort;
import com.eventos.domain.port.out.UserRepository;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class AdminSeeder {

    private final UserRepository userRepository;
    private final PasswordEncoderPort encoder;

    @Value("${ADMIN_EMAIL:admin@local}")
    private String adminEmail;

    @Value("${ADMIN_PASSWORD:Admin123!}")
    private String adminPassword;

    public AdminSeeder(UserRepository userRepository, PasswordEncoderPort encoder) {
        this.userRepository = userRepository;
        this.encoder = encoder;
    }

    @PostConstruct
    public void seed() {
        if (!userRepository.existsByEmail(adminEmail.toLowerCase())) {
            String hash = encoder.encode(adminPassword);
            User admin = new User("Administrador", adminEmail, hash, null, Role.ADMIN);
            userRepository.save(admin);
        }
    }
}
