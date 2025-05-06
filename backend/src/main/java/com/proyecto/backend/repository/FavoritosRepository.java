package com.proyecto.backend.repository;

import com.proyecto.backend.model.Favoritos;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.UserInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavoritosRepository extends JpaRepository<Favoritos, Long> {
    // Obtener todos los favoritos de un usuario
    List<Favoritos> findByUsuario(UserInfo usuario);

    // Verificar si un producto está en los favoritos de un usuario
    boolean existsByUsuarioAndProducto(UserInfo usuario, Producto producto);

    // Eliminar un producto de los favoritos de un usuario
    void deleteByUsuarioAndProducto(UserInfo usuario, Producto producto);
}