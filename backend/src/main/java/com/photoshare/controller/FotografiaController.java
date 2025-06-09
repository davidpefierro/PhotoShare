package com.photoshare.controller;


import com.photoshare.model.Fotografia;
import com.photoshare.service.FotografiaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/fotografias")
@CrossOrigin(origins = "*") // Ajusta según tu frontend
public class FotografiaController {

    // Lee la ruta de subida desde la variable de entorno (ideal para Docker)
    private static final String UPLOAD_DIR = System.getenv().getOrDefault("FILE_UPLOAD_DIR", "uploads/");

    @Autowired
    private FotografiaService fotografiaService;

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

            // Crea una carpeta por usuario si no existe
            String folderPath = UPLOAD_DIR + (UPLOAD_DIR.endsWith("/") ? "" : "/") + "usuario_" + idUsuario + "/";
            Files.createDirectories(Paths.get(folderPath));
            String filename = System.currentTimeMillis() + "_" + imageFile.getOriginalFilename();
            Path filePath = Paths.get(folderPath + filename);
            Files.write(filePath, imageFile.getBytes());

            // Construye la URL relativa para servir la imagen
            String url = "/uploads/usuario_" + idUsuario + "/" + filename;

            // Guarda en la base de datos
            Fotografia fotografia = new Fotografia();
            fotografia.setIdUsuario(idUsuario);
            fotografia.setUrl(url);
            fotografia.setDescripcion(descripcion);
            fotografia.setFechaPublicacion(LocalDateTime.now());

            Fotografia guardada = fotografiaService.save(fotografia);

            return ResponseEntity.ok().body(
                java.util.Map.of(
                    "success", true,
                    "data", java.util.Map.of(
                        "id", guardada.getIdFoto(),
                        "url", url,
                        "descripcion", descripcion
                    )
                )
            );
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                java.util.Map.of("success", false, "message", "Error al subir la foto")
            );
        }
    }
}