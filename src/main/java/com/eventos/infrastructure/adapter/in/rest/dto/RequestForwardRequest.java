package com.eventos.infrastructure.adapter.in.rest.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;

public class RequestForwardRequest {

    @NotNull(message = "originId es requerido")
    private Integer originId;

    @NotNull(message = "requestAmount es requerido")
    @DecimalMin(value = "0.0", inclusive = false, message = "requestAmount debe ser mayor a 0")
    private BigDecimal requestAmount;

    @NotBlank(message = "name es requerido")
    private String name;

    @NotBlank(message = "reason es requerido")
    private String reason;

    // Opcional. Si es null, se autogenera en el servicio.
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate requestDate;

    @NotBlank(message = "email es requerido")
    @Email(message = "email no tiene un formato válido")
    private String email;

    @NotNull(message = "priorityId es requerido")
    @Min(value = 1, message = "priorityId debe ser 1, 2 o 3")
    @Max(value = 3, message = "priorityId debe ser 1, 2 o 3")
    private Integer priorityId;

    public Integer getOriginId() {
        return originId;
    }

    public void setOriginId(Integer originId) {
        this.originId = originId;
    }

    public BigDecimal getRequestAmount() {
        return requestAmount;
    }

    public void setRequestAmount(BigDecimal requestAmount) {
        this.requestAmount = requestAmount;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public LocalDate getRequestDate() {
        return requestDate;
    }

    public void setRequestDate(LocalDate requestDate) {
        this.requestDate = requestDate;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Integer getPriorityId() {
        return priorityId;
    }

    public void setPriorityId(Integer priorityId) {
        this.priorityId = priorityId;
    }
}

