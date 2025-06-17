package com.photoshare.service;

import com.photoshare.model.Comentario;
import com.photoshare.model.Usuario;
import com.photoshare.dto.ComentarioResponseDTO;
import com.photoshare.dto.ComentarioCreateDTO;
import com.photoshare.repository.ComentarioRepository;
import com.photoshare.repository.UsuarioRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar comentarios por foto, mapeados a DTO
    public List<ComentarioResponseDTO> obtenerPorIdFoto(Integer idFoto) {
        List<Comentario> comentarios = comentarioRepository.findByIdFotoOrderByFechaPublicacionAsc(idFoto);

        // Opcional: cachear usuarios si hay muchos comentarios
        Map<Integer, String> usuariosMap = new HashMap<>();
        for (Comentario comentario : comentarios) {
            if (!usuariosMap.containsKey(comentario.getIdUsuario())) {
                Optional<Usuario> usuarioOpt = usuarioRepository.findById(comentario.getIdUsuario());
                usuariosMap.put(comentario.getIdUsuario(), usuarioOpt.map(Usuario::getNombreUsuario).orElse("Usuario"));
            }
        }

        return comentarios.stream().map(comentario -> {
            ComentarioResponseDTO dto = new ComentarioResponseDTO();
            dto.setIdComentario(comentario.getIdComentario());
            dto.setIdFoto(comentario.getIdFoto());
            dto.setIdUsuario(comentario.getIdUsuario());
            dto.setContenido(comentario.getContenido());
            dto.setFechaPublicacion(comentario.getFechaPublicacion());
            dto.setNombreUsuario(usuariosMap.get(comentario.getIdUsuario()));
            return dto;
        }).collect(Collectors.toList());
    }

    // Guardar un nuevo comentario a partir de DTO
    public ComentarioResponseDTO guardarComentario(ComentarioCreateDTO createDTO) {
        Comentario comentario = new Comentario();
        comentario.setIdFoto(createDTO.getIdFoto());
        comentario.setIdUsuario(createDTO.getIdUsuario());
        comentario.setContenido(createDTO.getContenido());
        comentario.setFechaPublicacion(LocalDateTime.now());

        Comentario guardado = comentarioRepository.save(comentario);

        // Cargar nombre de usuario
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(guardado.getIdUsuario());
        String nombreUsuario = usuarioOpt.map(Usuario::getNombreUsuario).orElse("Usuario");

        ComentarioResponseDTO dto = new ComentarioResponseDTO();
        dto.setIdComentario(guardado.getIdComentario());
        dto.setIdFoto(guardado.getIdFoto());
        dto.setIdUsuario(guardado.getIdUsuario());
        dto.setContenido(guardado.getContenido());
        dto.setFechaPublicacion(guardado.getFechaPublicacion());
        dto.setNombreUsuario(nombreUsuario);

        return dto;
    }

public boolean eliminarComentarioSiAutor(Integer idComentario, String username) {
    Comentario comentario = comentarioRepository.findById(idComentario)
        .orElseThrow(NoSuchElementException::new);

    // Busca el usuario autor del comentario usando idUsuario
    Optional<Usuario> usuarioOpt = usuarioRepository.findById(comentario.getIdUsuario());
    if (usuarioOpt.isEmpty() || !usuarioOpt.get().getNombreUsuario().equals(username)) {
        return false;
    }

    comentarioRepository.delete(comentario);
    return true;
}
}