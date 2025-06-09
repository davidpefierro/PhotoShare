package com.photoshare.model;

import jakarta.persistence.*;


import java.time.LocalDateTime;

@Entity
@Table(name = "me_gusta", uniqueConstraints = {@UniqueConstraint(columnNames = {"id_usuario", "id_foto"})})
public class MeGusta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_like")
    private Integer idLike;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_foto", nullable = false)
    private Integer idFoto;

    @Column(name = "fecha_like", nullable = false)
    private LocalDateTime fechaLike;

    // Constructores, getters y setters

    public MeGusta() {}

    public MeGusta(Integer idUsuario, Integer idFoto, LocalDateTime fechaLike) {
        this.idUsuario = idUsuario;
        this.idFoto = idFoto;
        this.fechaLike = fechaLike;
    }

    public Integer getIdLike() {
        return idLike;
    }

    public void setIdLike(Integer idLike) {
        this.idLike = idLike;
    }

    public Integer getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Integer idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Integer getIdFoto() {
        return idFoto;
    }

    public void setIdFoto(Integer idFoto) {
        this.idFoto = idFoto;
    }

    public LocalDateTime getFechaLike() {
        return fechaLike;
    }

    public void setFechaLike(LocalDateTime fechaLike) {
        this.fechaLike = fechaLike;
    }
}