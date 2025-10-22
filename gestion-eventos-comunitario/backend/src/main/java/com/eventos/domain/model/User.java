package com.eventos.domain.model;

import java.time.LocalDateTime;
import java.util.UUID;

public class User {
    private final String id;
    private String nombre;
    private String email;
    private String passwordHash;
    private String telefono;
    private Role role;
    private LocalDateTime creadoEn;

    // Constructor para nuevo usuario
    public User(String nombre, String email, String passwordHash, String telefono, Role role) {
        this.id = UUID.randomUUID().toString();
        this.nombre = nombre;
        this.email = email.toLowerCase();
        this.passwordHash = passwordHash;
        this.telefono = telefono;
        this.role = role;
        this.creadoEn = LocalDateTime.now();
    }

    // Reconstrucción
    public User(String id, String nombre, String email, String passwordHash, String telefono, Role role, LocalDateTime creadoEn) {
        this.id = id;
        this.nombre = nombre;
        this.email = email.toLowerCase();
        this.passwordHash = passwordHash;
        this.telefono = telefono;
        this.role = role;
        this.creadoEn = creadoEn;
    }

    // Getters/Setters
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getPasswordHash() { return passwordHash; }
    public String getTelefono() { return telefono; }
    public Role getRole() { return role; }
    public LocalDateTime getCreadoEn() { return creadoEn; }

    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public void setRole(Role role) { this.role = role; }
}
