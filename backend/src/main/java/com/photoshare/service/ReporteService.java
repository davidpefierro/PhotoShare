package com.photoshare.service;

import com.photoshare.model.Reporte;
import com.photoshare.repository.ReporteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ReporteService {
    @Autowired
    private ReporteRepository reporteRepository;

    public Reporte guardarReporte(Reporte reporte) {
        return reporteRepository.save(reporte);
    }
}