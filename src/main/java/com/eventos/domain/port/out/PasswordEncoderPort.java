package com.eventos.domain.port.out;

public interface PasswordEncoderPort {
    String encode(String raw);
    boolean matches(String raw, String hash);
}
