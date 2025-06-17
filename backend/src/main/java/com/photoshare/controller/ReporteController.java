package com.photoshare.controller;

import com.photoshare.model.Reporte;
import com.photoshare.model.Reporte.EstadoReporte;
import com.photoshare.model.Reporte.TipoContenido;
import com.photoshare.repository.UsuarioRepository;
import com.photoshare.repository.FotografiaRepository;
import com.photoshare.service.FotografiaService;
import com.photoshare.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @Autowired
    private FotografiaService fotografiaService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private FotografiaRepository fotografiaRepository;

    @PostMapping("")
    public ResponseEntity<?> reportarFoto(@RequestBody Map<String, Object> body) {
        try {
            Integer idReportador = (Integer) body.get("idReportador");
            Integer idDenunciado = (Integer) body.get("idDenunciado");
            String motivo = (String) body.get("motivo");
            Integer idFoto = body.get("idFoto") != null ? (Integer) body.get("idFoto") : null;

            if (idReportador == null || idDenunciado == null || motivo == null || idFoto == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Faltan datos obligatorios"));
            }

            if (!usuarioRepository.existsById(idReportador) || !usuarioRepository.existsById(idDenunciado)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Usuario no encontrado"));
            }

            if (!fotografiaRepository.existsById(idFoto)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Fotografía no encontrada"));
            }

            Reporte reporte = new Reporte();
            reporte.setIdReportador(idReportador);
            reporte.setIdDenunciado(idDenunciado);
            reporte.setMotivo(motivo);
            reporte.setTipoContenido(TipoContenido.Foto);
            reporte.setFechaReporte(LocalDateTime.now());
            reporte.setEstado(EstadoReporte.Pendiente);
            reporte.setIdFoto(idFoto);

            reporteService.guardarReporte(reporte);

            return ResponseEntity.ok(Map.of("success", true));
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("success", false, "message", "Error al reportar"));
        }
    }

    @GetMapping("")
    public ResponseEntity<?> obtenerTodosLosReportes() {
        return ResponseEntity.ok(reporteService.obtenerTodos());
    }

    // @PutMapping("/{id}/resolver")
    // public ResponseEntity<?> resolverReporte(@PathVariable Integer id) {
    //     reporteService.marcarComoResuelto(id);
    //     return ResponseEntity.ok().build();
    // }
    @PutMapping("/{id}/resolver")
public ResponseEntity<?> resolverReporte(@PathVariable Integer id) {
    // 1. Buscar el reporte
    Optional<Reporte> reporteOpt = reporteService.findById(id);
    if (reporteOpt.isEmpty()) {
        return ResponseEntity.notFound().build();
    }
    Reporte reporte = reporteOpt.get();

    // 2. Si es de tipo Foto, borrarla
    if (reporte.getTipoContenido() == Reporte.TipoContenido.Foto && reporte.getIdFoto() != null) {
        try {
            fotografiaService.delete(reporte.getIdFoto());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                .body(Map.of("success", false, "message", "Error al eliminar la foto"));
        }
    }

    // 3. Marcar reporte como resuelto
    reporteService.marcarComoResuelto(id);

    // 4. Respuesta OK
    return ResponseEntity.ok().build();
}
}