package com.eventos.infrastructure.email;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

public class SimpleTemplateEngine {

    public static String renderFromClasspath(String classpathLocation, Map<String, String> vars) {
        Objects.requireNonNull(classpathLocation, "classpathLocation");
        try (var in = SimpleTemplateEngine.class.getClassLoader().getResourceAsStream(classpathLocation)) {
            if (in == null) {
                throw new IllegalArgumentException("Template no encontrado en classpath: " + classpathLocation);
            }
            String html;
            try (var reader = new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8))) {
                html = reader.lines().collect(Collectors.joining("\n"));
            }
            if (vars != null) {
                for (var e : vars.entrySet()) {
                    String key = "{{" + e.getKey() + "}}";
                    html = html.replace(key, e.getValue() == null ? "" : e.getValue());
                }
            }
            return html;
        } catch (Exception ex) {
            throw new RuntimeException("Error renderizando template: " + classpathLocation, ex);
        }
    }
}

