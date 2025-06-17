package com.photoshare.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reporte")
public class Reporte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reporte")
    private Integer idReporte;

    @Column(name = "id_reportador", nullable = false)
    private Integer idReportador;

    @Column(name = "id_denunciado", nullable = false)
    private Integer idDenunciado;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_contenido", nullable = false)
    private TipoContenido tipoContenido;

    @Column(name = "motivo", nullable = false, columnDefinition = "TEXT")
    private String motivo;

    @Column(name = "fecha_reporte", nullable = false)
    private LocalDateTime fechaReporte;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado", nullable = false)
    private EstadoReporte estado;

    @Column(name = "id_foto", nullable = false)
    private Integer idFoto;

    public enum TipoContenido {
        Foto
    }

    public enum EstadoReporte {
        Pendiente, Resuelto
    }

    // Getters y setters
    public Integer getIdReporte() { return idReporte; }
    public void setIdReporte(Integer idReporte) { this.idReporte = idReporte; }

    public Integer getIdReportador() { return idReportador; }
    public void setIdReportador(Integer idReportador) { this.idReportador = idReportador; }

    public Integer getIdDenunciado() { return idDenunciado; }
    public void setIdDenunciado(Integer idDenunciado) { this.idDenunciado = idDenunciado; }

    public TipoContenido getTipoContenido() { return tipoContenido; }
    public void setTipoContenido(TipoContenido tipoContenido) { this.tipoContenido = tipoContenido; }

    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }

    public LocalDateTime getFechaReporte() { return fechaReporte; }
    public void setFechaReporte(LocalDateTime fechaReporte) { this.fechaReporte = fechaReporte; }

    public EstadoReporte getEstado() { return estado; }
    public void setEstado(EstadoReporte estado) { this.estado = estado; }

    public Integer getIdFoto() { return idFoto; }
    public void setIdFoto(Integer idFoto) { this.idFoto = idFoto; }
}