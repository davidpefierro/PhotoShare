package com.photoshare.service;

import com.photoshare.dto.MensajeDTO;
import com.photoshare.model.Mensaje;
import com.photoshare.model.Usuario;
import com.photoshare.repository.MensajeRepository;
import com.photoshare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MensajeService {

  private final MensajeRepository mensajeRepository;
  private final UsuarioRepository usuarioRepository;

  public void enviarMensaje(MensajeDTO dto) {
    Usuario remitente = usuarioRepository.findById(dto.getIdRemitente().longValue())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Remitente no encontrado"));
    Usuario destinatario = usuarioRepository.findById(dto.getIdDestinatario().longValue())
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Destinatario no encontrado"));

    // Aquí establecemos la zona horaria explícitamente
    ZonedDateTime fechaEnvio = ZonedDateTime.now(ZoneId.of("Europe/Madrid"));

    Mensaje mensaje = Mensaje.builder()
        .remitente(remitente)
        .destinatario(destinatario)
        .contenido(dto.getContenido())
        .fechaEnvio(fechaEnvio.toLocalDateTime()) // Guarda solo la parte local si tu modelo usa LocalDateTime
        .estado(Mensaje.Estado.No_visto)
        .build();

    mensajeRepository.save(mensaje);
  }

  public List<MensajeDTO> obtenerConversaciones(Integer idUsuario) {
    return mensajeRepository.findConversaciones(idUsuario.longValue()).stream()
        .map(MensajeDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public List<MensajeDTO> obtenerMensajes(Integer usuario1, Integer usuario2) {
    return mensajeRepository.findMensajesEntreUsuarios(usuario1.longValue(), usuario2.longValue()).stream()
        .map(MensajeDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public void marcarComoVisto(Long idMensaje) {
    Mensaje mensaje = mensajeRepository.findById(idMensaje)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Mensaje no encontrado"));
    mensaje.setEstado(Mensaje.Estado.Visto);
    mensajeRepository.save(mensaje);
  }
}