package com.eventos.infrastructure.adapter.in.rest.dto;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@JsonIgnoreProperties(ignoreUnknown = true)
public class ExternalApiEnvelope<T> {
    private boolean success;
    private String message;
    private T data;
    private Integer totalResults;

    public ExternalApiEnvelope() {}

    public ExternalApiEnvelope(boolean success, String message, T data, Integer totalResults) {
        this.success = success;
        this.message = message;
        this.data = data;
        this.totalResults = totalResults;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public T getData() { return data; }
    public void setData(T data) { this.data = data; }

    public Integer getTotalResults() { return totalResults; }
    public void setTotalResults(Integer totalResults) { this.totalResults = totalResults; }
}

