package com.proyecto.backend.service;

import com.proyecto.backend.model.Favoritos;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.repository.FavoritosRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.transaction.annotation.Transactional;

@Service
public class FavoritosService {

    @Autowired
    private FavoritosRepository favoritosRepository;

    // Obtener todos los favoritos de un usuario
    public List<Favoritos> obtenerFavoritosPorUsuario(UserInfo usuario) {
        return favoritosRepository.findByUsuario(usuario);
    }

    // Añadir un producto a los favoritos de un usuario
    public Favoritos agregarAFavoritos(UserInfo usuario, Producto producto) {
        if (!favoritosRepository.existsByUsuarioAndProducto(usuario, producto)) {
            Favoritos favorito = new Favoritos();
            favorito.setUsuario(usuario);
            favorito.setProducto(producto);
            return favoritosRepository.save(favorito);
        }
        return null; // Ya existe en favoritos
    }

    // Eliminar un producto de los favoritos de un usuario
    @Transactional
    public void eliminarDeFavoritos(UserInfo usuario, Producto producto) {
        if (favoritosRepository.existsByUsuarioAndProducto(usuario, producto)) {
            favoritosRepository.deleteByUsuarioAndProducto(usuario, producto);
        }
    }
}