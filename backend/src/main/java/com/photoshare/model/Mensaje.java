package com.photoshare.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "mensaje")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Mensaje {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id_mensaje")
  private Long idMensaje;

  @ManyToOne
  @JoinColumn(name = "id_remitente", nullable = false)
  private Usuario remitente;

  @ManyToOne
  @JoinColumn(name = "id_destinatario", nullable = false)
  private Usuario destinatario;

  @Column(name = "contenido", nullable = false, columnDefinition = "TEXT")
  private String contenido;

  @Column(name = "fecha_envio", nullable = false)
  private LocalDateTime fechaEnvio;

  @Enumerated(EnumType.STRING)
  @Column(name = "estado", nullable = false)
  private Estado estado;

  public enum Estado {
    Visto,
    No_visto
  }
}
