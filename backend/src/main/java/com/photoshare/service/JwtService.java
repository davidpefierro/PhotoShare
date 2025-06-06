package com.photoshare.service;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;
import java.util.Date;

import javax.crypto.SecretKey;

@Service
public class JwtService {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private Long jwtExpiration;

    public String generarToken(String nombreUsuario, String rol) {
       SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
return Jwts.builder()
    .setSubject(nombreUsuario)
    .claim("rol", rol)
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + jwtExpiration))
    .signWith(key, SignatureAlgorithm.HS256)
    .compact();
    }
}