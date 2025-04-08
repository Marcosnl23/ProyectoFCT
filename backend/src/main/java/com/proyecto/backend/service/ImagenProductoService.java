package com.proyecto.backend.service;

import com.proyecto.backend.model.ImagenProducto;
import com.proyecto.backend.repository.ImagenProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ImagenProductoService {

    @Autowired
    private ImagenProductoRepository imagenProductoRepository;

    public List<ImagenProducto> listarPorProducto(Long productoId) {
        return imagenProductoRepository.findByProductoId(productoId);
    }

    public ImagenProducto guardarImagen(ImagenProducto imagenProducto) {
        return imagenProductoRepository.save(imagenProducto);
    }

    public void eliminarImagen(Long id) {
        imagenProductoRepository.deleteById(id);
    }
}
