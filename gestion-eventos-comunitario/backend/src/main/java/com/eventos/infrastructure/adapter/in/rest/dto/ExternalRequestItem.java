package com.eventos.infrastructure.adapter.in.rest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.JsonNode;

import java.math.BigDecimal;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalRequestItem {
    private Integer id;
    private Integer originId;
    private BigDecimal requestAmount;
    private String name;
    private String reason;
    private String requestDate;
    private Integer requestStatusId;
    private String approvedDate;
    private String email;
    private String rejectionReason;
    private String authorizedReason;
    private Integer priorityId;
    private Integer state;
    private Integer createdBy;
    private Integer updatedBy;
    private String createdAt;
    private String updatedAt;
    private JsonNode origin;
    private JsonNode requestStatus;
    private JsonNode priority;

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public Integer getOriginId() { return originId; }
    public void setOriginId(Integer originId) { this.originId = originId; }

    public BigDecimal getRequestAmount() { return requestAmount; }
    public void setRequestAmount(BigDecimal requestAmount) { this.requestAmount = requestAmount; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }

    public String getRequestDate() { return requestDate; }
    public void setRequestDate(String requestDate) { this.requestDate = requestDate; }

    public Integer getRequestStatusId() { return requestStatusId; }
    public void setRequestStatusId(Integer requestStatusId) { this.requestStatusId = requestStatusId; }

    public String getApprovedDate() { return approvedDate; }
    public void setApprovedDate(String approvedDate) { this.approvedDate = approvedDate; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRejectionReason() { return rejectionReason; }
    public void setRejectionReason(String rejectionReason) { this.rejectionReason = rejectionReason; }

    public String getAuthorizedReason() { return authorizedReason; }
    public void setAuthorizedReason(String authorizedReason) { this.authorizedReason = authorizedReason; }

    public Integer getPriorityId() { return priorityId; }
    public void setPriorityId(Integer priorityId) { this.priorityId = priorityId; }

    public Integer getState() { return state; }
    public void setState(Integer state) { this.state = state; }

    public Integer getCreatedBy() { return createdBy; }
    public void setCreatedBy(Integer createdBy) { this.createdBy = createdBy; }

    public Integer getUpdatedBy() { return updatedBy; }
    public void setUpdatedBy(Integer updatedBy) { this.updatedBy = updatedBy; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }

    public JsonNode getOrigin() { return origin; }
    public void setOrigin(JsonNode origin) { this.origin = origin; }

    public JsonNode getRequestStatus() { return requestStatus; }
    public void setRequestStatus(JsonNode requestStatus) { this.requestStatus = requestStatus; }

    public JsonNode getPriority() { return priority; }
    public void setPriority(JsonNode priority) { this.priority = priority; }
}

