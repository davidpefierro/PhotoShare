package com.photoshare.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class JwtService {
    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generarToken(String nombreUsuario, String rol) {
        return Jwts.builder()
                .setSubject(nombreUsuario)
                .claim("rol", rol)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
                .signWith(SignatureAlgorithm.HS512, jwtSecret)
                .compact();
    }
}