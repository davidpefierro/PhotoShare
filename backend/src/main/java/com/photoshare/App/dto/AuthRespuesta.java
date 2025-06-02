package com.photoshare.app.dto;

import com.photoshare.app.modelo.Rol;
import com.photoshare.app.modelo.EstadoUsuario;
import lombok.*;

@Data
@Builder
public class AuthRespuesta {
  private Long id;
  private String email;
  private String nombre;
  private String apellido;
  private String username;
  private String token;
  private Rol rol;
  private EstadoUsuario estado;
  private String fechaRegistro;
}