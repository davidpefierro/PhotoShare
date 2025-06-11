package com.photoshare.controller;

import com.photoshare.model.Fotografia;
import com.photoshare.model.Usuario;
import com.photoshare.repository.UsuarioRepository;
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
import java.util.Optional;

@RestController
@RequestMapping("/api/fotografias")
@CrossOrigin(origins = "*")
public class FotografiaController {

    private static final String UPLOAD_DIR = System.getenv().getOrDefault("FILE_UPLOAD_DIR", "uploads/");

    @Autowired
    private FotografiaService fotografiaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    // Listar todas las fotos (paginado) con idUsuario opcional
    @GetMapping("")
    public ResponseEntity<?> listarPaginado(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer idUsuario // usuario autenticado opcional
    ) {
        return ResponseEntity.ok(fotografiaService.findAll(PageRequest.of(page, size), idUsuario));
    }

    // Listar fotos de un usuario por ID con idUsuarioAuth opcional
    @GetMapping("/user/{idUsuario}")
    public ResponseEntity<?> listarPorUsuario(
            @PathVariable Integer idUsuario,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer idUsuarioAuth // usuario autenticado opcional
    ) {
        return ResponseEntity.ok(fotografiaService.findByUsuario(idUsuario, PageRequest.of(page, size), idUsuarioAuth));
    }

    // Obtener foto por id con idUsuario opcional
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerFotoPorId(
            @PathVariable Integer id,
            @RequestParam(required = false) Integer idUsuario // usuario autenticado opcional
    ) {
        return fotografiaService.findById(id, idUsuario)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Subir foto usando nombreUsuario
    @PostMapping("/upload")
    public ResponseEntity<?> uploadFotografia(
            @RequestParam("imageFile") MultipartFile imageFile,
            @RequestParam("descripcion") String descripcion,
            @RequestParam("nombreUsuario") String nombreUsuario
    ) {
        try {
            System.out.println("Intentando subir foto de usuario: " + nombreUsuario + " con descripción: " + descripcion);

            Optional<Usuario> usuarioOpt = usuarioRepository.findByNombreUsuario(nombreUsuario);
            if (usuarioOpt.isEmpty()) {
                System.out.println("Usuario no encontrado: " + nombreUsuario);
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }
            Usuario usuario = usuarioOpt.get();
            Integer idUsuario = usuario.getIdUsuario().intValue();
            System.out.println("ID del usuario encontrado: " + idUsuario);
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
            System.out.println("Error real al subir la foto:");
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(
                    Map.of("success", false, "message", "No se pudo subir la foto.")
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

    @PostMapping("/{id}/like")
    public ResponseEntity<?> likeFoto(@PathVariable Integer id, @RequestParam Integer idUsuario) {
        boolean liked = fotografiaService.likePhoto(id, idUsuario);
        int count = fotografiaService.likesCount(id);
        return ResponseEntity.ok(Map.of("liked", true, "likesCount", count));
    }

    @PostMapping("/{id}/unlike")
    public ResponseEntity<?> unlikeFoto(@PathVariable Integer id, @RequestParam Integer idUsuario) {
        boolean unliked = fotografiaService.unlikePhoto(id, idUsuario);
        int count = fotografiaService.likesCount(id);
        return ResponseEntity.ok(Map.of("liked", false, "likesCount", count));
    }

    @GetMapping("/{id}/likes")
    public ResponseEntity<?> getLikes(@PathVariable Integer id, @RequestParam Integer idUsuario) {
        boolean liked = fotografiaService.userLiked(id, idUsuario);
        int count = fotografiaService.likesCount(id);
        return ResponseEntity.ok(Map.of("liked", liked, "likesCount", count));
    }
}