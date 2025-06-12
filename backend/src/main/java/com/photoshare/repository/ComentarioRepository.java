package com.photoshare.repository;

import com.photoshare.model.Comentario;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface ComentarioRepository extends JpaRepository<Comentario, Integer> {
    List<Comentario> findByIdFotoOrderByFechaPublicacionAsc(Integer idFoto);
    Long countByIdFoto(Integer idFoto);
}