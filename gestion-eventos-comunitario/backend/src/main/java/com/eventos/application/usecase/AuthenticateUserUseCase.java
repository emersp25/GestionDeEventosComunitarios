package com.eventos.application.usecase;

import com.eventos.domain.model.User;
import com.eventos.domain.port.out.JwtTokenProviderPort;
import com.eventos.domain.port.out.PasswordEncoderPort;
import com.eventos.domain.port.out.UserRepository;

import java.util.Map;

public class AuthenticateUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoder;
    private final JwtTokenProviderPort jwt;

    private final long defaultExpMinutes;

    public AuthenticateUserUseCase(UserRepository userRepository,
                                   PasswordEncoderPort passwordEncoder,
                                   JwtTokenProviderPort jwt,
                                   long defaultExpMinutes) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwt = jwt;
        this.defaultExpMinutes = defaultExpMinutes;
    }

    public record LoginCommand(String email, String password) {}
    public record LoginResult(String token, String nombre, String email, String role) {}

    public LoginResult execute(LoginCommand cmd) {
        User user = userRepository.findByEmail(cmd.email().toLowerCase())
                .orElseThrow(() -> new IllegalArgumentException("Credenciales inválidas"));
        if (!passwordEncoder.matches(cmd.password(), user.getPasswordHash())) {
            throw new IllegalArgumentException("Credenciales inválidas");
        }
        String token = jwt.generateToken(user.getEmail(), user.getRole(), defaultExpMinutes, Map.of("name", user.getNombre()));
        return new LoginResult(token, user.getNombre(), user.getEmail(), user.getRole().name());
    }
}
