package com.proyecto.backend.service;

import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.repository.ProductoTallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ProductoTallaService {

    @Autowired
    private ProductoTallaRepository productoTallaRepository;

    public List<ProductoTalla> listarPorProducto(Long productoId) {
        return productoTallaRepository.findByProductoId(productoId);
    }

    public ProductoTalla guardarProductoTalla(ProductoTalla productoTalla) {
        return productoTallaRepository.save(productoTalla);
    }

    public void eliminarProductoTalla(Long id) {
        productoTallaRepository.deleteById(id);
    }
}
