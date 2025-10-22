package com.eventos.infrastructure.adapter.out.security;

import com.eventos.domain.model.Role;
import com.eventos.domain.model.User;
import com.eventos.domain.port.out.JwtTokenProviderPort;
import com.eventos.domain.port.out.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.AbstractAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import java.io.IOException;
import java.util.List;
import java.util.Optional;

public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtTokenProviderPort jwt;
    private final UserRepository userRepository;

    public JwtAuthFilter(JwtTokenProviderPort jwt, UserRepository userRepository) {
        this.jwt = jwt;
        this.userRepository = userRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res, FilterChain chain)
            throws ServletException, IOException {
        String header = req.getHeader(HttpHeaders.AUTHORIZATION);
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);
            if (jwt.validate(token)) {
                String email = jwt.getSubject(token);
                Optional<User> userOpt = userRepository.findByEmail(email);
                if (userOpt.isPresent()) {
                    Role role = userOpt.get().getRole();
                    var auth = new AbstractAuthenticationToken(List.of(new SimpleGrantedAuthority("ROLE_" + role.name()))) {
                        @Override public Object getCredentials() { return token; }
                        @Override public Object getPrincipal() { return email; }
                    };
                    auth.setAuthenticated(true);
                    SecurityContextHolder.getContext().setAuthentication(auth);
                }
            }
        }
        chain.doFilter(req, res);
    }
}

