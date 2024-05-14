package com.kreitefy.infraestructure.repository;


import com.kreitefy.domain.entity.Canciones;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CancionesRepository extends JpaRepository<Canciones, Long>, JpaSpecificationExecutor<Canciones> {
    Page<Canciones> findByEstilo(String estilo, Pageable pageable);
    List<Canciones> findByPuntuacionGreaterThanAndReproduccionesGreaterThan(int puntuacion, int reproducciones, Pageable pageable);

}
