package com.photoshare.controller;

import com.photoshare.dto.ComentarioCreateDTO;
import com.photoshare.dto.ComentarioResponseDTO;
import com.photoshare.model.Comentario;
import com.photoshare.model.Usuario;
import com.photoshare.repository.UsuarioRepository;
import com.photoshare.service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;
import java.util.*;

@RestController
@RequestMapping("/api/comentarios")
@CrossOrigin(origins = "*")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    // Obtener comentarios de una foto
    @GetMapping("/foto/{idFoto}")
    public ResponseEntity<?> obtenerComentariosPorFoto(@PathVariable Integer idFoto) {
        List<ComentarioResponseDTO> dtos = comentarioService.obtenerPorIdFoto(idFoto);
        Map<String, Object> resp = new HashMap<>();
        resp.put("success", true);
        resp.put("data", dtos);
        return ResponseEntity.ok(resp);
    }

    // Subir comentario (requiere idFoto, idUsuario, contenido)
    @PostMapping("")
    public ResponseEntity<?> crearComentario(@RequestBody ComentarioCreateDTO body) {
        try {
            ComentarioResponseDTO dto = comentarioService.guardarComentario(body);
            Map<String, Object> resp = new HashMap<>();
            resp.put("success", true);
            resp.put("data", dto);
            return ResponseEntity.ok(resp);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "No se pudo crear el comentario"));
        }
    }
}