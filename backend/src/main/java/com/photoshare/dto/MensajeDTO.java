package com.photoshare.dto;

import com.photoshare.model.Mensaje;
import lombok.*;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MensajeDTO {
  private Long idMensaje;
  private Integer idRemitente;
  private Integer idDestinatario;
  private String contenido;
  private LocalDateTime fechaEnvio;
  private String estado;

  public static MensajeDTO fromEntity(Mensaje mensaje) {
    return MensajeDTO.builder()
        .idMensaje(mensaje.getIdMensaje())
        .idRemitente(mensaje.getRemitente().getIdUsuario().intValue())
        .idDestinatario(mensaje.getDestinatario().getIdUsuario().intValue())
        .contenido(mensaje.getContenido())
        .fechaEnvio(mensaje.getFechaEnvio())
        .estado(mensaje.getEstado().name())
        .build();
  }
}