package com.eventos.infrastructure.adapter.in.rest.dto.auth;

public class RegisterResponse {
    private String id;
    private String nombre;
    private String email;
    private String role;

    public RegisterResponse() {}
    public RegisterResponse(String id, String nombre, String email, String role) {
        this.id = id; this.nombre = nombre; this.email = email; this.role = role;
    }
    public String getId() { return id; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public void setId(String id) { this.id = id; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}
