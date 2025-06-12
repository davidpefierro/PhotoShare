package com.photoshare.controller;

import com.photoshare.dto.MensajeDTO;
import com.photoshare.service.MensajeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/mensajes")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class MensajeController {

  private final MensajeService mensajeService;

  @PostMapping
  public ResponseEntity<Void> enviarMensaje(@RequestBody MensajeDTO mensajeDTO) {
    mensajeService.enviarMensaje(mensajeDTO);
    return ResponseEntity.ok().build();
  }

  @GetMapping("/conversaciones/{idUsuario}")
  public ResponseEntity<List<MensajeDTO>> obtenerConversaciones(@PathVariable Integer idUsuario) {
    return ResponseEntity.ok(mensajeService.obtenerConversaciones(idUsuario));
  }

  @GetMapping("/chat")
  public ResponseEntity<List<MensajeDTO>> obtenerMensajesEntreUsuarios(@RequestParam Integer usuario1,
      @RequestParam Integer usuario2) {
    return ResponseEntity.ok(mensajeService.obtenerMensajes(usuario1, usuario2));
  }

  @PutMapping("/marcar-visto/{idMensaje}")
  public ResponseEntity<Void> marcarComoVisto(@PathVariable Long idMensaje) {
    mensajeService.marcarComoVisto(idMensaje);
    return ResponseEntity.noContent().build();
  }

  @DeleteMapping("/{idMensaje}")
  public ResponseEntity<Void> eliminarMensaje(@PathVariable Long idMensaje) {
    mensajeService.eliminarMensaje(idMensaje);
    return ResponseEntity.noContent().build();
  }

}