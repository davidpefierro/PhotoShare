package com.photoshare.dto;

import com.photoshare.model.Usuario;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
  private Integer idUsuario;
  private String nombre;
  private String apellidos;
  private String nombreUsuario;
  private String correo;
  private String rol;
  private String estado;

  public static UsuarioDTO fromEntity(Usuario usuario) {
    return UsuarioDTO.builder()
        .idUsuario(usuario.getIdUsuario() != null ? usuario.getIdUsuario() : null)
        .nombre(usuario.getNombre())
        .apellidos(usuario.getApellidos())
        .nombreUsuario(usuario.getNombreUsuario())
        .correo(usuario.getCorreo())
        .rol(usuario.getRol().name())
        .estado(usuario.getEstado().name())
        .build();
  }
}