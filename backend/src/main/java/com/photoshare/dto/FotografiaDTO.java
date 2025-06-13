package com.photoshare.dto;

import com.photoshare.model.Fotografia;
import com.photoshare.model.Usuario;
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
    private Integer commentsCount;

    // Método estático para mapear desde la entidad Fotografia al DTO.
    public static FotografiaDTO fromEntity(Fotografia foto) {
        return FotografiaDTO.builder()
                .idFoto(foto.getIdFoto())
                .url(foto.getUrl())
                .descripcion(foto.getDescripcion())
                .fechaPublicacion(foto.getFechaPublicacion() != null ? foto.getFechaPublicacion().toString() : null)
                .idUsuario(foto.getIdUsuario())
                // likesCount, userLiked y commentsCount deben setearse luego si quieres que
                // tengan valor real
                .likesCount(0)
                .userLiked(false)
                .commentsCount(0)
                .build();
    }
}