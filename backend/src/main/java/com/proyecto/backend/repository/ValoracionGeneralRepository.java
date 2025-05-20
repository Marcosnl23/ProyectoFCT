package com.proyecto.backend.repository;

import com.proyecto.backend.model.ValoracionGeneral;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ValoracionGeneralRepository extends JpaRepository<ValoracionGeneral, Long> {
    boolean existsByUsuarioId(Long usuarioId);
}
