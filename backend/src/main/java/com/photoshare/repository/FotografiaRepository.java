package com.photoshare.repository;

import com.photoshare.model.Fotografia;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FotografiaRepository extends JpaRepository<Fotografia, Integer> {
}