package com.eventos.infrastructure.config;

import com.eventos.domain.port.out.JwtTokenProviderPort;
import com.eventos.domain.port.out.UserRepository;
import com.eventos.infrastructure.adapter.out.security.JwtAuthFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.header.writers.ReferrerPolicyHeaderWriter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http,
                                           JwtTokenProviderPort jwt,
                                           UserRepository userRepository) throws Exception {
        http
                .csrf(csrf -> csrf.disable())
                .cors(Customizer.withDefaults())
                .headers(h -> h
                                .contentSecurityPolicy(csp -> csp
                                        .policyDirectives("default-src 'self'; object-src 'none'; frame-ancestors 'none'"))
                                .frameOptions(fo -> fo.deny())
                                .referrerPolicy(rp -> rp.policy(ReferrerPolicyHeaderWriter.ReferrerPolicy.NO_REFERRER))
                        // (Opcional) HSTS si se usa sobre HTTPS detrás de proxy
                        // .httpStrictTransportSecurity(hsts -> hsts.includeSubDomains(true).preload(true))
                )
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/actuator/health", "/v3/api-docs/**", "/swagger-ui/**").permitAll()
                        .requestMatchers("/api/v1/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/eventos/**").permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/v1/inscripciones").permitAll()
                        // Solo ADMIN:
                        .requestMatchers("/api/v1/reportes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/v1/eventos").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/v1/eventos/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/eventos/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .addFilterBefore(new JwtAuthFilter(jwt, userRepository), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        var c = new CorsConfiguration();
        c.setAllowedOrigins(List.of("http://localhost:5173"));
        c.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        c.setAllowedHeaders(List.of("Content-Type","Authorization"));
        c.setAllowCredentials(false);

        var source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", c);
        return source;
    }
}
