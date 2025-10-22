package com.eventos.infrastructure.config;

import com.eventos.application.usecase.AuthenticateUserUseCase;
import com.eventos.application.usecase.RegisterUserUseCase;
import com.eventos.domain.port.out.JwtTokenProviderPort;
import com.eventos.domain.port.out.PasswordEncoderPort;
import com.eventos.domain.port.out.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class AuthUseCaseConfig {

    @Bean
    public RegisterUserUseCase registerUserUseCase(UserRepository userRepository, PasswordEncoderPort encoder) {
        return new RegisterUserUseCase(userRepository, encoder);
    }

    @Bean
    public AuthenticateUserUseCase authenticateUserUseCase(UserRepository userRepository,
                                                           PasswordEncoderPort encoder,
                                                           JwtTokenProviderPort jwt,
                                                           @Value("${jwt.exp-min:60}") long expMinutes) {
        return new AuthenticateUserUseCase(userRepository, encoder, jwt, expMinutes);
    }
}
