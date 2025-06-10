package com.photoshare.dto;

import com.photoshare.model.Usuario;
import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioDTO {
  private Long idUsuario;
  private String nombre;
  private String nombreUsuario;
  private String correo;
  private String rol;

  public static UsuarioDTO fromEntity(Usuario usuario) {
    return UsuarioDTO.builder()
        .idUsuario(usuario.getIdUsuario())
        .nombre(usuario.getNombre())
        .nombreUsuario(usuario.getNombreUsuario())
        .correo(usuario.getCorreo())
        .rol(usuario.getRol().name())
        .build();
  }
}
