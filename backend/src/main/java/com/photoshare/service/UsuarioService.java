package com.photoshare.service;

import com.photoshare.dto.UsuarioDTO;
import com.photoshare.model.Usuario;
import com.photoshare.repository.UsuarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UsuarioService {

  private final UsuarioRepository usuarioRepository;

  public List<UsuarioDTO> obtenerTodos() {
    return usuarioRepository.findAll().stream()
        .map(UsuarioDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public void eliminarPorId(Long id) {
    if (!usuarioRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }
    usuarioRepository.deleteById(id);
  }

  public void actualizarRol(Long idUsuario, String nuevoRol) {
    Usuario usuario = usuarioRepository.findById(idUsuario)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    try {
      usuario.setRol(Usuario.Rol.valueOf(nuevoRol));
      usuarioRepository.save(usuario);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol inválido");
    }
  }

  public void actualizarEstado(Long idUsuario, String nuevoEstado) {
    Usuario usuario = usuarioRepository.findById(idUsuario)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));
    try {
      usuario.setEstado(Usuario.Estado.valueOf(nuevoEstado));
      usuarioRepository.save(usuario);
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Estado inválido");
    }
  }
}
