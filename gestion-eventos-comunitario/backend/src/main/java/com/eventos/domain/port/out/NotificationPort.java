package com.eventos.domain.port.out;

import java.util.Collection;

public interface NotificationPort {
    void send(String to, String subject, String body);
    default void sendBulk(Collection<String> recipients, String subject, String body) {
        if (recipients == null) return;
        for (String to : recipients) send(to, subject, body);
    }

    // HTML
    default void sendHtml(String to, String subject, String html) {
        // Por defecto, enviar como texto (el adapter real lo overridea a HTML)
        send(to, subject, html);
    }

    default void sendHtmlBulk(Collection<String> recipients, String subject, String html) {
        if (recipients == null) return;
        for (String to : recipients) sendHtml(to, subject, html);
    }
}
