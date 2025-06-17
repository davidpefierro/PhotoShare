package com.photoshare.controller;

import com.photoshare.dto.ComentarioCreateDTO;
import com.photoshare.dto.ComentarioResponseDTO;
import com.photoshare.service.ComentarioService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import java.security.Principal;

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

@DeleteMapping("/{idComentario}")
public ResponseEntity<?> eliminarComentario(
        @PathVariable Integer idComentario,
        @RequestParam String nombreUsuario // Recibe el nombre de usuario por query param
) {
    try {
        boolean deleted = comentarioService.eliminarComentarioSiAutor(idComentario, nombreUsuario);
        if (deleted) {
            return ResponseEntity.ok(Map.of("success", true));
        } else {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "No autorizado para eliminar este comentario."));
        }
    } catch (NoSuchElementException e) {
        return ResponseEntity.status(404).body(Map.of("success", false, "message", "Comentario no encontrado."));
    } catch (Exception e) {
        e.printStackTrace();
        return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error eliminando comentario: " + e.getMessage()));
    }
}
}