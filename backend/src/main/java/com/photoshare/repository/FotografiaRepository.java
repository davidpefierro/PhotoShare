package com.photoshare.repository;

import com.photoshare.model.Fotografia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FotografiaRepository extends JpaRepository<Fotografia, Integer> {
    Page<Fotografia> findByIdUsuario(Integer idUsuario, Pageable pageable);
}