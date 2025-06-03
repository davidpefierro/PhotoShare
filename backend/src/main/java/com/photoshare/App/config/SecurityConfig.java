package com.photoshare.app.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors() // Usa el bean global de CORS
            .and()
            .csrf().disable()
            .authorizeHttpRequests()
                .anyRequest().permitAll();
        return http.build();
    }
}