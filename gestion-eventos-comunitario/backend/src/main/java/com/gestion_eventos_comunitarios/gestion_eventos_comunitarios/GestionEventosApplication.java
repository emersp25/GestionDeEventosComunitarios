package com.eventos;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Aplicación principal de Gestión de Eventos Comunitarios
 * Arquitectura Hexagonal (Ports & Adapters)
 * 
 * @author Tu Nombre
 * @version 1.0.0
 */
@SpringBootApplication
public class GestionEventosApplication {

	public static void main(String[] args) {
		SpringApplication.run(GestionEventosApplication.class, args);
		System.out.println("\n========================================");
		System.out.println("Gestión de Eventos Comunitarios");
		System.out.println("========================================");
		System.out.println("Aplicación iniciada correctamente");
		System.out.println("Puerto: http://localhost:8080");
		System.out.println("H2 Console: http://localhost:8080/h2-console");
		System.out.println("========================================\n");
	}

}