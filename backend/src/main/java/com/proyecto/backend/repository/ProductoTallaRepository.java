package com.proyecto.backend.repository;

import com.proyecto.backend.model.ProductoTalla;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoTallaRepository extends JpaRepository<ProductoTalla, Long> {
    List<ProductoTalla> findByProductoId(Long productoId);
    void deleteByProductoId(Long productoId);
    Optional<ProductoTalla> findByProductoIdAndTallaId(Long productoId, Long tallaId);
}

