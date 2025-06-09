package com.photoshare.service;

import com.photoshare.model.Fotografia;
import com.photoshare.repository.FotografiaRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class FotografiaService {

    private final FotografiaRepository fotografiaRepository;

    public FotografiaService(FotografiaRepository fotografiaRepository) {
        this.fotografiaRepository = fotografiaRepository;
    }

    public Page<Fotografia> findAll(PageRequest pageRequest) {
        return fotografiaRepository.findAll(pageRequest);
    }

    public Optional<Fotografia> findById(Integer id) {
        return fotografiaRepository.findById(id);
    }

    public Fotografia save(Fotografia fotografia) {
        return fotografiaRepository.save(fotografia);
    }

    // Listar fotos de un usuario
    public Page<Fotografia> findByUsuario(Integer idUsuario, PageRequest pageRequest) {
        return fotografiaRepository.findByIdUsuario(idUsuario, pageRequest);
    }

    // Eliminar foto
    public void delete(Integer idFoto) {
        fotografiaRepository.deleteById(idFoto);
    }

    // Dar like a una foto (requiere implementar la lógica en la tabla me_gusta)
    public boolean likePhoto(Integer idFoto, Integer idUsuario) {
        // Implementa la lógica para guardar en la tabla me_gusta si no existe
        // Devuelve true si el like fue exitoso, false si ya existía
        // Esto es solo un ejemplo de estructura:
        // if (!meGustaRepository.existsByIdFotoAndIdUsuario(idFoto, idUsuario)) {
        //     MeGusta meGusta = new MeGusta(idFoto, idUsuario, LocalDateTime.now());
        //     meGustaRepository.save(meGusta);
        //     return true;
        // }
        // return false;
        return true; // Placeholder, implementa según tu entidad MeGusta
    }

    // Quitar like a una foto
    public boolean unlikePhoto(Integer idFoto, Integer idUsuario) {
        // Implementa la lógica para eliminar de la tabla me_gusta si existe
        // Devuelve true si el unlike fue exitoso, false si no existía
        // Esto es solo un ejemplo de estructura:
        // if (meGustaRepository.existsByIdFotoAndIdUsuario(idFoto, idUsuario)) {
        //     meGustaRepository.deleteByIdFotoAndIdUsuario(idFoto, idUsuario);
        //     return false;
        // }
        // return true;
        return false; // Placeholder, implementa según tu entidad MeGusta
    }
}