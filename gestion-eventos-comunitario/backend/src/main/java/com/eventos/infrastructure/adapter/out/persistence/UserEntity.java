package com.eventos.infrastructure.adapter.out.persistence;

import com.eventos.domain.model.Role;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(name="uk_users_email", columnNames = "email"))
public class UserEntity {

    @Id
    private String id;

    private String nombre;

    @Column(nullable = false)
    private String email;

    @Column(name="password_hash", nullable = false)
    private String passwordHash;

    private String telefono;

    @Enumerated(EnumType.STRING)
    private Role role;

    private LocalDateTime creadoEn;

    // getters/setters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getTelefono() { return telefono; }
    public Role getRole() { return role; }
    public LocalDateTime getCreadoEn() { return creadoEn; }

    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setRole(Role role) { this.role = role; }
    public void setCreadoEn(LocalDateTime creadoEn) { this.creadoEn = creadoEn; }
}
