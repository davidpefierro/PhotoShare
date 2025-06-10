package com.photoshare.dto;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FotografiaDTO {
    private Integer idFoto;
    private String url;
    private String descripcion;
    private String fechaPublicacion;
    private Integer idUsuario;
    private String nombreUsuario; // <-- Este campo es el alias del usuario

    // Si quieres devolver el usuario como objeto anidado, puedes hacer:
    // private UsuarioDTO usuario;
}