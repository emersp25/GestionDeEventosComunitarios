package com.eventos.application.usecase;

import com.eventos.domain.model.Role;
import com.eventos.domain.model.User;
import com.eventos.domain.port.out.PasswordEncoderPort;
import com.eventos.domain.port.out.UserRepository;

public class RegisterUserUseCase {

    private final UserRepository userRepository;
    private final PasswordEncoderPort passwordEncoder;

    public RegisterUserUseCase(UserRepository userRepository, PasswordEncoderPort passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public record RegisterCommand(String nombre, String email, String password, String telefono) {}

    public record RegisterResult(String id, String nombre, String email, String role) {}

    public RegisterResult execute(RegisterCommand cmd) {
        if (userRepository.existsByEmail(cmd.email().toLowerCase())) {
            throw new IllegalArgumentException("El email ya está registrado");
        }
        String hash = passwordEncoder.encode(cmd.password());
        User user = new User(cmd.nombre(), cmd.email(), hash, cmd.telefono(), Role.USER);
        User saved = userRepository.save(user);
        return new RegisterResult(saved.getId(), saved.getNombre(), saved.getEmail(), saved.getRole().name());
    }
}
