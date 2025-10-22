package com.eventos.infrastructure.adapter.in.rest.dto.auth;

public class MeResponse {
    private String email;
    private String role;

    public MeResponse() {}
    public MeResponse(String email, String role) {
        this.email = email; this.role = role;
    }
    public String getEmail() { return email; }
    public String getRole() { return role; }
    public void setEmail(String email) { this.email = email; }
    public void setRole(String role) { this.role = role; }
}

