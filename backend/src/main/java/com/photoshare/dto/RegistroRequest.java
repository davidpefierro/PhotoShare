package com.photoshare.dto;

import lombok.Data;

@Data
public class RegistroRequest {
    private String nombre;
    private String apellidos;
    private String nombreUsuario;
    private String correo;
    private String contrasena;
}