package com.proyecto.backend.service;

import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.model.Talla;
import com.proyecto.backend.repository.ProductoTallaRepository;
import com.proyecto.backend.repository.TallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TallaService {

    @Autowired
    private TallaRepository tallaRepository;
    @Autowired
    private ProductoTallaRepository productoTallaRepository;

    public List<Talla> listarTallas() {
        return tallaRepository.findAll();
    }

    public Talla obtenerTallaPorId(Long id) {
        return tallaRepository.findById(id).orElse(null);
    }

    public Talla guardarTalla(Talla talla) {
        return tallaRepository.save(talla);
    }

    public Talla actualizarTalla(Long id, Talla talla) {
        if (tallaRepository.existsById(id)) {
            talla.setId(id);
            return tallaRepository.save(talla);
        } else {
            return null;
        }
    }

    public void eliminarTalla(Long id) {
        tallaRepository.deleteById(id);
    }

    public List<Talla> obtenerTallasPorProductoId(Long productoId) {
        List<ProductoTalla> productoTallas = productoTallaRepository.findByProductoId(productoId);
        return productoTallas.stream()
                .map(ProductoTalla::getTalla)
                .collect(Collectors.toList());
    }
}
