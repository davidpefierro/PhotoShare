package com.photoshare.controller;

import com.photoshare.model.Usuario;
import com.photoshare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/usuarios")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Permite peticiones desde cualquier origen (ajusta según tu seguridad)
public class UsuarioController {

  private final UsuarioRepository usuarioRepository;

  @GetMapping
  public List<Usuario> listarUsuarios() {
    return usuarioRepository.findAll();
  }
}