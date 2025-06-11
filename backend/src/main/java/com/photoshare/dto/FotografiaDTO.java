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
    private String nombreUsuario;
    private Integer likesCount;
    private Boolean userLiked;
}