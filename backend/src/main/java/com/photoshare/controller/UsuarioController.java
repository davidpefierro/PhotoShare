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

  // @GetMapping
  // public ResponseEntity<List<UsuarioDTO>> obtenerTodos() {
  //   return ResponseEntity.ok(usuarioService.obtenerTodos());
  // }

  @GetMapping
  public ResponseEntity<List<UsuarioDTO>> obtenerTodos(@RequestParam Integer idActual) {
    return ResponseEntity.ok(usuarioService.obtenerTodosExcluyendo(idActual));
  }

  @DeleteMapping("/{idUsuario}")
  public ResponseEntity<Void> eliminarUsuario(@PathVariable Integer idUsuario) {
    usuarioService.eliminarPorId(idUsuario);
    return ResponseEntity.noContent().build();
  }

  @PutMapping("/{idUsuario}")
  public ResponseEntity<Void> actualizarUsuario(@PathVariable Integer idUsuario, @RequestBody UsuarioDTO dto) {
    usuarioService.actualizarUsuario(idUsuario, dto);
    return ResponseEntity.noContent().build();
  }

  @GetMapping("/{idUsuario}")
  public ResponseEntity<UsuarioDTO> obtenerUsuarioPorId(@PathVariable Long idUsuario) {
    return ResponseEntity.ok(usuarioService.obtenerUsuarioPorId(idUsuario));
  }
}