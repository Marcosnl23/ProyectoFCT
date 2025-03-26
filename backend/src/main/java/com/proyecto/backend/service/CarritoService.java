package com.proyecto.backend.service;

import com.proyecto.backend.model.Carrito;
import com.proyecto.backend.repository.CarritoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class CarritoService {
    @Autowired
    private CarritoRepository carritoRepository;

    // Obtener el carrito de un usuario
    public List<Carrito> obtenerCarritoDeUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    // Agregar un producto al carrito
    public Carrito agregarAlCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    // Eliminar un producto del carrito
    public void eliminarDelCarrito(Long id) {
        carritoRepository.deleteById(id);
    }
}

