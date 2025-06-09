package com.photoshare.controller;

import com.photoshare.model.Fotografia;
import com.photoshare.service.FotografiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/fotografias")
@CrossOrigin(origins = "*")
public class FotografiaController {

    private static final String UPLOAD_DIR = System.getenv().getOrDefault("FILE_UPLOAD_DIR", "uploads/");

    @Autowired
    private FotografiaService fotografiaService;

    @GetMapping("")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(fotografiaService.findAll(PageRequest.of(page, size)));
    }

    // Listar fotos de un usuario
    @GetMapping("/user/{idUsuario}")
    public ResponseEntity<?> listarPorUsuario(
            @PathVariable Integer idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        return ResponseEntity.ok(fotografiaService.findByUsuario(idUsuario, PageRequest.of(page, size)));
    }

    // Obtener foto por id
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerFotoPorId(@PathVariable Integer id) {
        return fotografiaService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Subir foto
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFotografia(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("idUsuario") Integer idUsuario
    ) {
        try {
            if (imageFile.isEmpty()) {
                return ResponseEntity.badRequest().body("No se subió ninguna imagen");
            }
            if (!imageFile.getContentType().startsWith("image/")) {
                return ResponseEntity.badRequest().body("Solo se permiten imágenes");
            }
            if (imageFile.getSize() > 10 * 1024 * 1024) {
                return ResponseEntity.badRequest().body("El tamaño del archivo debe ser menor a 10MB");
            }

            String folderPath = UPLOAD_DIR + (UPLOAD_DIR.endsWith("/") ? "" : "/") + "usuario_" + idUsuario + "/";
            Files.createDirectories(Paths.get(folderPath));
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(folderPath + filename);
            Files.write(filePath, imageFile.getBytes());

            String url = "/uploads/usuario_" + idUsuario + "/" + filename;

            Fotografia fotografia = new Fotografia();
            fotografia.setIdUsuario(idUsuario);
            fotografia.setUrl(url);
            fotografia.setDescripcion(descripcion);
            fotografia.setFechaPublicacion(LocalDateTime.now());

            Fotografia guardada = fotografiaService.save(fotografia);

            return ResponseEntity.ok().body(
                    Map.of(
                            "success", true,
                            "data", Map.of(
                                    "id", guardada.getIdFoto(),
                                    "url", url,
                                    "descripcion", descripcion
                            )
                    )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Error al subir la foto")
            );
        }
    }

    // Eliminar foto
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarFoto(@PathVariable Integer id) {
        try {
            fotografiaService.delete(id);
            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Error al eliminar la foto")
            );
        }
    }

    // Dar like a foto (requiere lógica de base de datos para likes)
    @PostMapping("/{id}/like")
    public ResponseEntity<?> darLike(
            @PathVariable Integer id,
            @RequestParam("idUsuario") Integer idUsuario
    ) {
        try {
            boolean liked = fotografiaService.likePhoto(id, idUsuario);
            return ResponseEntity.ok(Map.of("success", true, "liked", liked));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Error al dar like")
            );
        }
    }

    // Quitar like a foto
    @DeleteMapping("/{id}/like")
    public ResponseEntity<?> quitarLike(
            @PathVariable Integer id,
            @RequestParam("idUsuario") Integer idUsuario
    ) {
        try {
            boolean liked = fotografiaService.unlikePhoto(id, idUsuario);
            return ResponseEntity.ok(Map.of("success", true, "liked", liked));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "Error al quitar el like")
            );
        }
    }
}