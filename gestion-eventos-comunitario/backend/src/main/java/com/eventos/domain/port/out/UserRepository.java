package com.eventos.domain.port.out;

import com.eventos.domain.model.User;

import java.util.Optional;

public interface UserRepository {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    User save(User user);
}
