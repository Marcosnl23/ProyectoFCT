package com.proyecto.backend.repository;

import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.model.Talla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TallaRepository extends JpaRepository<Talla, Long> {


}