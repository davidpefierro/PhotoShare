package com.photoshare.controller;

import com.photoshare.model.Reporte;
import com.photoshare.model.Reporte.EstadoReporte;
import com.photoshare.model.Reporte.TipoContenido;
import com.photoshare.repository.UsuarioRepository;
import com.photoshare.service.ReporteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "*")
public class ReporteController {

    @Autowired
    private ReporteService reporteService;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @PostMapping("")
    public ResponseEntity<?> reportarFoto(@RequestBody Map<String, Object> body) {
        try {
            Integer idReportador = (Integer) body.get("idReportador");
            Integer idDenunciado = (Integer) body.get("idDenunciado");
            String motivo = (String) body.get("motivo");
            String tipoContenido = (String) body.get("tipoContenido");

            if (idReportador == null || idDenunciado == null || motivo == null || tipoContenido == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "message", "Faltan datos obligatorios"));
            }

            if (!usuarioRepository.existsById(idReportador) || !usuarioRepository.existsById(idDenunciado)) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "message", "Usuario no encontrado"));
            }

            Reporte reporte = new Reporte();
            reporte.setIdReportador(idReportador);
            reporte.setIdDenunciado(idDenunciado);
            reporte.setMotivo(motivo);
            reporte.setTipoContenido(TipoContenido.valueOf(tipoContenido));
            reporte.setFechaReporte(LocalDateTime.now());
            reporte.setEstado(EstadoReporte.Pendiente);

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

    @PutMapping("/{id}/resolver")
    public ResponseEntity<?> resolverReporte(@PathVariable Integer id) {
        reporteService.marcarComoResuelto(id);
        return ResponseEntity.ok().build();
    }

}