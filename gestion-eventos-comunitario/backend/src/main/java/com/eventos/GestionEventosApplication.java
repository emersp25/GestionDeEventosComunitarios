package com.eventos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.event.EventListener;

@SpringBootApplication(scanBasePackages = {"com.eventos"})
@ConfigurationPropertiesScan(basePackages = {"com.eventos"})
public class GestionEventosApplication extends SpringBootServletInitializer {
    public static void main(String[] args) {
        SpringApplication.run(GestionEventosApplication.class, args);
    }
    @EventListener(ApplicationReadyEvent.class)
    public void onReady() {
        System.out.println("Aplicación iniciada");
        System.out.println("http://localhost:8080/swagger-ui/index.html#/");
    }
}
