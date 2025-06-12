package com.photoshare.service;

import com.photoshare.dto.FotografiaDTO;
import com.photoshare.model.Fotografia;
import com.photoshare.model.MeGusta;
import com.photoshare.model.Usuario;
import com.photoshare.repository.FotografiaRepository;
import com.photoshare.repository.MeGustaRepository;
import com.photoshare.repository.UsuarioRepository;
import org.springframework.data.domain.PageRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FotografiaService {

    private final FotografiaRepository fotografiaRepository;
    private final UsuarioRepository usuarioRepository;
    @Autowired
    private MeGustaRepository meGustaRepository;

    public FotografiaService(FotografiaRepository fotografiaRepository, UsuarioRepository usuarioRepository) {
        this.fotografiaRepository = fotografiaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    // Devuelve la paginación de DTOs con nombreUsuario
    public Page<FotografiaDTO> findAll(PageRequest pageRequest) {
        Page<Fotografia> fotos = fotografiaRepository.findAll(pageRequest);
        List<FotografiaDTO> dtos = fotos.stream().map(foto -> {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(foto.getIdUsuario().longValue());
            String nombreUsuario = usuarioOpt.map(Usuario::getNombreUsuario).orElse("Usuario");
            return FotografiaDTO.builder()
                    .idFoto(foto.getIdFoto())
                    .url(foto.getUrl())
                    .descripcion(foto.getDescripcion())
                    .fechaPublicacion(foto.getFechaPublicacion() != null ? foto.getFechaPublicacion().toString() : null)
                    .idUsuario(foto.getIdUsuario())
                    .nombreUsuario(nombreUsuario)
                    .build();
        }).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageRequest, fotos.getTotalElements());
    }

    public Optional<FotografiaDTO> findById(Integer id) {
        Optional<Fotografia> fotoOpt = fotografiaRepository.findById(id);
        if (fotoOpt.isEmpty())
            return Optional.empty();
        Fotografia foto = fotoOpt.get();
        Optional<Usuario> usuarioOpt = usuarioRepository.findById(foto.getIdUsuario().longValue());
        String nombreUsuario = usuarioOpt.map(Usuario::getNombreUsuario).orElse("Usuario");
        FotografiaDTO dto = FotografiaDTO.builder()
                .idFoto(foto.getIdFoto())
                .url(foto.getUrl())
                .descripcion(foto.getDescripcion())
                .fechaPublicacion(foto.getFechaPublicacion() != null ? foto.getFechaPublicacion().toString() : null)
                .idUsuario(foto.getIdUsuario())
                .nombreUsuario(nombreUsuario)
                .build();
        return Optional.of(dto);
    }

    public Fotografia save(Fotografia fotografia) {
        return fotografiaRepository.save(fotografia);
    }

    // Listar fotos de un usuario (por idUsuario)
    public Page<FotografiaDTO> findByUsuario(Integer idUsuario, PageRequest pageRequest) {
        Page<Fotografia> fotos = fotografiaRepository.findByIdUsuario(idUsuario, pageRequest);
        List<FotografiaDTO> dtos = fotos.stream().map(foto -> {
            Optional<Usuario> usuarioOpt = usuarioRepository.findById(foto.getIdUsuario().longValue());
            String nombreUsuario = usuarioOpt.map(Usuario::getNombreUsuario).orElse("Usuario");
            return FotografiaDTO.builder()
                    .idFoto(foto.getIdFoto())
                    .url(foto.getUrl())
                    .descripcion(foto.getDescripcion())
                    .fechaPublicacion(foto.getFechaPublicacion() != null ? foto.getFechaPublicacion().toString() : null)
                    .idUsuario(foto.getIdUsuario())
                    .nombreUsuario(nombreUsuario)
                    .build();
        }).collect(Collectors.toList());
        return new PageImpl<>(dtos, pageRequest, fotos.getTotalElements());
    }

    public void delete(Integer idFoto) {
        fotografiaRepository.deleteById(idFoto);
    }

    // Dar like a una foto
    public boolean likePhoto(Integer idFoto, Integer idUsuario) {
        if (!meGustaRepository.existsByIdFotoAndIdUsuario(idFoto, idUsuario)) {
            ZonedDateTime fechaLike = ZonedDateTime.now(ZoneId.of("Europe/Madrid"));
            MeGusta meGusta = new MeGusta(idUsuario, idFoto, fechaLike.toLocalDateTime());
            meGustaRepository.save(meGusta);
            return true;
        }
        return false;
    }

    // Quitar like a una foto
    public boolean unlikePhoto(Integer idFoto, Integer idUsuario) {
        if (meGustaRepository.existsByIdFotoAndIdUsuario(idFoto, idUsuario)) {
            meGustaRepository.deleteByIdFotoAndIdUsuario(idFoto, idUsuario);
            return true;
        }
        return false;
    }

    // Saber si un usuario ha dado MG
    public boolean userLiked(Integer idFoto, Integer idUsuario) {
        return meGustaRepository.existsByIdFotoAndIdUsuario(idFoto, idUsuario);
    }

    // Contar likes totales de una foto
    public int likesCount(Integer idFoto) {
        return meGustaRepository.countByIdFoto(idFoto);
    }

}