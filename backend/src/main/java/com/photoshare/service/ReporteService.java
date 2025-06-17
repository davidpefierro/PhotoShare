package com.photoshare.service;

import com.photoshare.model.Reporte;
import com.photoshare.model.Reporte.EstadoReporte;
import com.photoshare.repository.ReporteRepository;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ReporteService {
    @Autowired
    private ReporteRepository reporteRepository;

    public Reporte guardarReporte(Reporte reporte) {
        return reporteRepository.save(reporte);
    }

    public List<Reporte> obtenerTodos() {
        return reporteRepository.findAll();
    }

    public void marcarComoResuelto(Integer id) {
        Reporte reporte = reporteRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Reporte no encontrado"));

        reporte.setEstado(Reporte.EstadoReporte.Resuelto); // Enum con valor 'Resuelto'
        reporteRepository.save(reporte);
    }

}