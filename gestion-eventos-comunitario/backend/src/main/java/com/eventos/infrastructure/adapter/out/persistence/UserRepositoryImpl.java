package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.User;
import com.eventos.domain.port.out.UserRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UserRepositoryImpl implements UserRepository {

    private final UserJpaRepository jpa;

    public UserRepositoryImpl(UserJpaRepository jpa) {
        this.jpa = jpa;
    }

    @Override
    public Optional<User> findByEmail(String email) {
        return jpa.findByEmail(email.toLowerCase()).map(this::toDomain);
    }

    @Override
    public boolean existsByEmail(String email) {
        return jpa.existsByEmail(email.toLowerCase());
    }

    @Override
    public User save(User user) {
        UserEntity e = toEntity(user);
        UserEntity saved = jpa.save(e);
        return toDomain(saved);
    }

    private User toDomain(UserEntity e) {
        return new User(
                e.getId(),
                e.getNombre(),
                e.getEmail(),
                e.getPasswordHash(),
                e.getTelefono(),
                e.getRole(),
                e.getCreadoEn()
        );
    }

    private UserEntity toEntity(User u) {
        UserEntity e = new UserEntity();
        e.setId(u.getId());
        e.setNombre(u.getNombre());
        e.setEmail(u.getEmail());
        e.setPasswordHash(u.getPasswordHash());
        e.setTelefono(u.getTelefono());
        e.setRole(u.getRole());
        e.setCreadoEn(u.getCreadoEn());
        return e;
    }
}
