package com.photoshare.controller;

import com.photoshare.dto.UsuarioDTO;
import com.photoshare.service.UsuarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UsuarioController {

  private final UsuarioService usuarioService;

  @GetMapping
  public ResponseEntity<List<UsuarioDTO>> obtenerTodos() {
    return ResponseEntity.ok(usuarioService.obtenerTodos());
  }

  @DeleteMapping("/{idUsuario}")
  public ResponseEntity<Void> eliminarUsuario(@PathVariable Long idUsuario) {
    usuarioService.eliminarPorId(idUsuario);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{idUsuario}/rol")
  public ResponseEntity<Void> actualizarRol(@PathVariable Long idUsuario, @RequestBody String nuevoRol) {
    usuarioService.actualizarRol(idUsuario, nuevoRol);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{idUsuario}/estado")
  public ResponseEntity<Void> actualizarEstado(@PathVariable Long idUsuario, @RequestBody String nuevoEstado) {
    usuarioService.actualizarEstado(idUsuario, nuevoEstado);
    return ResponseEntity.noContent().build();
  }
}
