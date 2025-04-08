package com.proyecto.backend.repository;

import com.proyecto.backend.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    List<Producto> findByCategoriaId(Long categoriaId);
    @Query(value = "SELECT p.* FROM productos p " +
            "JOIN imagenes_productos i ON p.id = i.producto_id " +
            "GROUP BY p.id " +
            "ORDER BY p.precio DESC " +
            "LIMIT 4", nativeQuery = true)
    List<Producto> findProductosDestacados();
}
