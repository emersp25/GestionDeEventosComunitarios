package com.eventos.domain.port.out;

import com.eventos.domain.model.Role;

import java.util.Map;

public interface JwtTokenProviderPort {
    String generateToken(String subjectEmail, Role role, long expirationMinutes, Map<String,Object> extraClaims);
    boolean validate(String token);
    String getSubject(String token);
    String getRole(String token);
}

