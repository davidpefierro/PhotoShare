package com.photoshare.app.servicio;

import com.photoshare.app.dto.*;
import com.photoshare.app.modelo.*;
import com.photoshare.app.repositorio.UsuarioRepositorio;
import com.photoshare.app.seguridad.JwtUtilidad;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class AuthServicio {

  @Autowired
  private UsuarioRepositorio usuarioRepositorio;

  @Autowired
  private JwtUtilidad jwtUtilidad;

  @Autowired
  private PasswordEncoder passwordEncoder;

  public AuthRespuesta login(LoginPeticion peticion) {
    Usuario usuario = usuarioRepositorio.findByEmail(peticion.getEmail())
        .orElseThrow(() -> new RuntimeException("Email o contraseña inválidos"));

    if (!passwordEncoder.matches(peticion.getPassword(), usuario.getPassword())) {
      throw new RuntimeException("Email o contraseña inválidos");
    }

    String token = jwtUtilidad.generarToken(usuario.getUsername());

    return AuthRespuesta.builder()
        .id(usuario.getId())
        .email(usuario.getEmail())
        .nombre(usuario.getNombre())
        .apellido(usuario.getApellido())
        .username(usuario.getUsername())
        .rol(usuario.getRol())
        .estado(usuario.getEstado())
        .fechaRegistro(usuario.getFechaRegistro())
        .token(token)
        .build();
  }

  public AuthRespuesta registrar(RegistroPeticion peticion) {
    if (usuarioRepositorio.findByEmail(peticion.getEmail()).isPresent()) {
      throw new RuntimeException("El email ya está en uso");
    }
    if (usuarioRepositorio.findByUsername(peticion.getUsername()).isPresent()) {
      throw new RuntimeException("El nombre de usuario ya está en uso");
    }

    Usuario usuario = Usuario.builder()
        .email(peticion.getEmail())
        .password(passwordEncoder.encode(peticion.getPassword()))
        .nombre(peticion.getNombre())
        .apellido(peticion.getApellido())
        .username(peticion.getUsername())
        .rol(Rol.USUARIO)
        .estado(EstadoUsuario.ACTIVO)
        .fechaRegistro(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")))
        .build();

    usuarioRepositorio.save(usuario);

    String token = jwtUtilidad.generarToken(usuario.getUsername());

    return AuthRespuesta.builder()
        .id(usuario.getId())
        .email(usuario.getEmail())
        .nombre(usuario.getNombre())
        .apellido(usuario.getApellido())
        .username(usuario.getUsername())
        .rol(usuario.getRol())
        .estado(usuario.getEstado())
        .fechaRegistro(usuario.getFechaRegistro())
        .token(token)
        .build();
  }
}