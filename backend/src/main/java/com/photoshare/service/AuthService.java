package com.photoshare.service;

import com.photoshare.dto.LoginRequest;
import com.photoshare.dto.RegistroRequest;
import com.photoshare.dto.AuthResponse;
import com.photoshare.model.Usuario;
import com.photoshare.repository.UsuarioRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.ZoneId;
import java.time.ZonedDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthResponse registrar(RegistroRequest request) {
        if (usuarioRepository.findByNombreUsuario(request.getNombreUsuario()).isPresent() ||
                usuarioRepository.findByCorreo(request.getCorreo()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El usuario o correo ya existe");
        }

        // Usa la zona horaria adecuada para España peninsular, por ejemplo
        ZonedDateTime fechaRegistro = ZonedDateTime.now(ZoneId.of("Europe/Madrid"));

        Usuario usuario = Usuario.builder()
                .nombre(request.getNombre())
                .apellidos(request.getApellidos())
                .nombreUsuario(request.getNombreUsuario())
                .correo(request.getCorreo())
                .contrasena(passwordEncoder.encode(request.getContrasena()))
                .fechaRegistro(fechaRegistro.toLocalDateTime()) // Si tu modelo usa LocalDateTime
                .rol(Usuario.Rol.Usuario)
                .estado(Usuario.Estado.Activo)
                .build();
        usuarioRepository.save(usuario);
        String token = jwtService.generarToken(usuario.getNombreUsuario(), usuario.getRol().name());
        return new AuthResponse(
                token,
                usuario.getNombreUsuario(),
                usuario.getRol().name(),
                usuario.getIdUsuario() != null ? usuario.getIdUsuario().longValue() : null);
    }

    public AuthResponse login(LoginRequest request) {
        Usuario usuario = usuarioRepository.findByNombreUsuario(request.getNombreUsuario())
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        if (!passwordEncoder.matches(request.getContrasena(), usuario.getContrasena()))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciales inválidas");
        if (usuario.getEstado() == Usuario.Estado.Bloqueado)
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Usuario bloqueado");
        String token = jwtService.generarToken(usuario.getNombreUsuario(), usuario.getRol().name());
        return new AuthResponse(
                token,
                usuario.getNombreUsuario(),
                usuario.getRol().name(),
                usuario.getIdUsuario() != null ? usuario.getIdUsuario().longValue() : null);
    }
}