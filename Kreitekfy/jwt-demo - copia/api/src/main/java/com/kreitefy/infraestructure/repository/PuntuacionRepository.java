package com.kreitefy.infraestructure.repository;

import com.kreitefy.domain.entity.Puntuacion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PuntuacionRepository extends JpaRepository<Puntuacion, Long> {
}