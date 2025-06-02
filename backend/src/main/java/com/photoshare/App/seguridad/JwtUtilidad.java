package com.photoshare.app.seguridad;

import io.jsonwebtoken.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;

@Component
public class JwtUtilidad {

  @Value("${jwt.secreto}")
  private String secreto;

  @Value("${jwt.expiracion}")
  private long expiracion;

  public String generarToken(String username) {
    return Jwts.builder()
        .setSubject(username)
        .setIssuedAt(new Date(System.currentTimeMillis()))
        .setExpiration(new Date(System.currentTimeMillis() + expiracion))
        .signWith(SignatureAlgorithm.HS256, secreto)
        .compact();
  }

  public String extraerUsername(String token) {
    return Jwts.parser()
        .setSigningKey(secreto)
        .parseClaimsJws(token)
        .getBody()
        .getSubject();
  }

  public boolean validarToken(String token) {
    try {
      Jwts.parser().setSigningKey(secreto).parseClaimsJws(token);
      return true;
    } catch (JwtException | IllegalArgumentException e) {
      return false;
    }
  }
}