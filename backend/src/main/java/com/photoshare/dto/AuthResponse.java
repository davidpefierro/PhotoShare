package com.photoshare.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String nombreUsuario;
    private String rol;
    private Long idUsuario;
}