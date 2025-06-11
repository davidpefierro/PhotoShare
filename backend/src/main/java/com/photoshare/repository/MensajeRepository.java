package com.photoshare.repository;

import com.photoshare.model.Mensaje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MensajeRepository extends JpaRepository<Mensaje, Long> {

  @Query("""
          SELECT m FROM Mensaje m
          WHERE (m.remitente.idUsuario = :usuario1 AND m.destinatario.idUsuario = :usuario2)
             OR (m.remitente.idUsuario = :usuario2 AND m.destinatario.idUsuario = :usuario1)
          ORDER BY m.fechaEnvio ASC
      """)
  List<Mensaje> findMensajesEntreUsuarios(Long usuario1, Long usuario2);

  @Query("""
          SELECT m FROM Mensaje m
          WHERE m.idMensaje IN (
              SELECT MAX(m2.idMensaje) FROM Mensaje m2
              WHERE m2.remitente.idUsuario = :idUsuario OR m2.destinatario.idUsuario = :idUsuario
              GROUP BY
                  CASE
                      WHEN m2.remitente.idUsuario = :idUsuario THEN m2.destinatario.idUsuario
                      ELSE m2.remitente.idUsuario
                  END
          )
          ORDER BY m.fechaEnvio DESC
      """)
  List<Mensaje> findConversaciones(Long idUsuario);
}
