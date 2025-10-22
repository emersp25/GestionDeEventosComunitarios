package com.eventos.infrastructure.adapter.out.security;

import com.eventos.domain.model.Role;
import com.eventos.domain.port.out.JwtTokenProviderPort;
import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;
import java.util.Map;

@Component
public class JwtTokenProviderAdapter implements JwtTokenProviderPort {

    private final SecretKey key;

    public JwtTokenProviderAdapter(@Value("${jwt.secret}") String secret) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public String generateToken(String subjectEmail, Role role, long expirationMinutes, Map<String, Object> extraClaims) {
        Instant now = Instant.now();
        Instant exp = now.plusSeconds(expirationMinutes * 60);
        JwtBuilder builder = Jwts.builder()
                .subject(subjectEmail)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key, Jwts.SIG.HS256);

        if (extraClaims != null) {
            extraClaims.forEach(builder::claim);
        }
        return builder.compact();
    }

    @Override
    public boolean validate(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

    @Override
    public String getSubject(String token) {
        return Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().getSubject();
    }

    @Override
    public String getRole(String token) {
        Object r = Jwts.parser().verifyWith(key).build().parseSignedClaims(token).getPayload().get("role");
        return r == null ? null : r.toString();
    }
}
