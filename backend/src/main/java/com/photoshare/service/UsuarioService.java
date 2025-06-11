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

  // Devuelve todos los usuarios excepto el actual
  public List<UsuarioDTO> obtenerTodosExcluyendo(Integer idActual) {
    return usuarioRepository.findAll().stream()
        .filter(usuario -> !usuario.getIdUsuario().equals(idActual))
        .map(UsuarioDTO::fromEntity)
        .collect(Collectors.toList());
  }

  public void eliminarPorId(Integer id) {
    if (!usuarioRepository.existsById(id)) {
      throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado");
    }
    usuarioRepository.deleteById(id);
  }

  public void actualizarUsuario(Integer id, UsuarioDTO dto) {
    Usuario usuario = usuarioRepository.findById(id)
        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Usuario no encontrado"));

    usuario.setNombre(dto.getNombre());
    usuario.setApellidos(dto.getApellidos());
    usuario.setNombreUsuario(dto.getNombreUsuario());
    usuario.setCorreo(dto.getCorreo());

    try {
      usuario.setRol(Usuario.Rol.valueOf(dto.getRol()));
      usuario.setEstado(Usuario.Estado.valueOf(dto.getEstado()));
    } catch (IllegalArgumentException e) {
      throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol o estado inválido");
    }

    usuarioRepository.save(usuario);
  }
}