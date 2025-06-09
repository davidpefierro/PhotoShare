package com.photoshare.service;

import com.photoshare.model.Fotografia;
import com.photoshare.repository.FotografiaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class FotografiaService {

    @Autowired
    private FotografiaRepository fotografiaRepository;

    public Fotografia save(Fotografia fotografia) {
        return fotografiaRepository.save(fotografia);
    }
}