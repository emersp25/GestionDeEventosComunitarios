package com.eventos.infrastructure.adapter.in.rest.controller;

import com.eventos.application.usecase.AuthenticateUserUseCase;
import com.eventos.application.usecase.RegisterUserUseCase;
import com.eventos.infrastructure.adapter.in.rest.dto.ApiResponse;
import com.eventos.infrastructure.adapter.in.rest.dto.auth.*;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final RegisterUserUseCase registerUserUseCase;
    private final AuthenticateUserUseCase authenticateUserUseCase;

    public AuthController(RegisterUserUseCase registerUserUseCase,
                          AuthenticateUserUseCase authenticateUserUseCase) {
        this.registerUserUseCase = registerUserUseCase;
        this.authenticateUserUseCase = authenticateUserUseCase;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public ApiResponse<RegisterResponse> register(@Valid @RequestBody RegisterRequest request) {
        var cmd = new RegisterUserUseCase.RegisterCommand(
                request.getNombre(),
                request.getEmail(),
                request.getPassword(),
                request.getTelefono()
        );
        var r = registerUserUseCase.execute(cmd);
        return ApiResponse.success(new RegisterResponse(r.id(), r.nombre(), r.email(), r.role()), "Usuario registrado");
    }

    @PostMapping("/login")
    public ApiResponse<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        var cmd = new AuthenticateUserUseCase.LoginCommand(request.getEmail(), request.getPassword());
        var r = authenticateUserUseCase.execute(cmd);
        return ApiResponse.success(new LoginResponse(r.token(), r.nombre(), r.email(), r.role()), "Login exitoso");
    }

    @GetMapping("/me")
    public ApiResponse<MeResponse> me(Authentication auth) {
        if (auth == null) return ApiResponse.error("No autenticado");
        String email = (String) auth.getPrincipal();
        String role = auth.getAuthorities().stream().findFirst().map(a -> a.getAuthority()).orElse("ROLE_USER");
        return ApiResponse.success(new MeResponse(email, role), "Perfil");
    }
}

