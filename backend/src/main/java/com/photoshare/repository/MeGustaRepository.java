package com.photoshare.repository;

import com.photoshare.model.MeGusta;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeGustaRepository extends JpaRepository<MeGusta, Integer> {
    boolean existsByIdFotoAndIdUsuario(Integer idFoto, Integer idUsuario);
    void deleteByIdFotoAndIdUsuario(Integer idFoto, Integer idUsuario);
}