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

    public List<Carrito> listarCarritoPorUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }

    public Carrito agregarAlCarrito(Carrito carrito) {
        return carritoRepository.save(carrito);
    }

    public void eliminarDelCarrito(Long id) {
        carritoRepository.deleteById(id);
    }

    public List<Carrito> obtenerCarritoDeUsuario(Long usuarioId) {
        return carritoRepository.findByUsuarioId(usuarioId);
    }
}
