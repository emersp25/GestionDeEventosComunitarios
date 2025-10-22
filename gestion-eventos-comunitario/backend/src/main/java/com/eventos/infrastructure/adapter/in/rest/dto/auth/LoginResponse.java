package com.eventos.infrastructure.adapter.in.rest.dto.auth;

public class LoginResponse {
    private String token;
    private String nombre;
    private String email;
    private String role;

    public LoginResponse() {}
    public LoginResponse(String token, String nombre, String email, String role) {
        this.token = token; this.nombre = nombre; this.email = email; this.role = role;
    }
    public String getToken() { return token; }
    public String getNombre() { return nombre; }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public void setToken(String token) { this.token = token; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}

