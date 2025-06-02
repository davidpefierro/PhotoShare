package com.photoshare.app.dto;

import lombok.Data;

@Data
public class RegistroPeticion {
  private String email;
  private String password;
  private String nombre;
  private String apellido;
  private String username;
}