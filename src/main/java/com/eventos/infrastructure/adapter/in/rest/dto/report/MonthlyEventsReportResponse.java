package com.eventos.infrastructure.adapter.in.rest.dto.report;

public class MonthlyEventsReportResponse {
    private int year;
    private int month;
    private long total;

    public MonthlyEventsReportResponse() {}

    public MonthlyEventsReportResponse(int year, int month, long total) {
        this.year = year;
        this.month = month;
        this.total = total;
    }

    public int getYear() { return year; }
    public int getMonth() { return month; }
    public long getTotal() { return total; }

    public void setYear(int year) { this.year = year; }
    public void setMonth(int month) { this.month = month; }
    public void setTotal(long total) { this.total = total; }
}
