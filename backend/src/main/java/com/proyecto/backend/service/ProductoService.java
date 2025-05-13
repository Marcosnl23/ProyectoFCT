package com.proyecto.backend.service;

import com.proyecto.backend.model.Categoria;
import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.model.Talla;
import com.proyecto.backend.repository.ProductoRepository;
import com.proyecto.backend.repository.ProductoTallaRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.proyecto.backend.repository.TallaRepository;
import com.proyecto.backend.repository.CategoriaRepository;

import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
public class ProductoService {

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private ProductoTallaRepository productoTallaRepository;

    @Autowired
    private TallaRepository tallaRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<Producto> listarProductos() {
        return productoRepository.findAll();
    }

    public Optional<Producto> buscarPorId(Long id) {
        return productoRepository.findById(id);
    }

    public List<Producto> buscarPorCategoria(Long categoriaId) {
        return productoRepository.findByCategoriaId(categoriaId);
    }

    @Transactional
    public Producto guardarProducto(Producto producto, Long categoriaId, List<ProductoTalla> tallas) {
        // Asignar la categoría usando el ID
        if (categoriaId != null) {
            Categoria categoria = categoriaRepository.findById(categoriaId)
                    .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
            producto.setCategoria(categoria);
        }

        // Guardar el producto
        Producto productoGuardado = productoRepository.save(producto);

        // Asignar las tallas usando los IDs
        if (tallas != null && !tallas.isEmpty()) {
            for (ProductoTalla talla : tallas) {
                if (talla.getTalla() != null && talla.getTalla().getId() != null) {
                    Talla tallaEntidad = tallaRepository.findById(talla.getTalla().getId())
                            .orElseThrow(() -> new IllegalArgumentException("Talla no encontrada"));
                    talla.setTalla(tallaEntidad);
                }
                talla.setProducto(productoGuardado);
                productoTallaRepository.save(talla);
            }
        }

        return productoGuardado;
    }

    @Transactional
    public void eliminarProducto(Long id) {
        // Primero eliminamos las tallas asociadas
        productoTallaRepository.deleteByProductoId(id);
        // Luego eliminamos el producto
        productoRepository.deleteById(id);
    }

    @Transactional
    public Optional<Producto> actualizarProducto(Long id, Producto producto, Long categoriaId, List<ProductoTalla> tallas) {
        return productoRepository.findById(id)
                .map(productoExistente -> {
                    productoExistente.setNombre(producto.getNombre());
                    productoExistente.setDescripcion(producto.getDescripcion());
                    productoExistente.setPrecio(producto.getPrecio());
                    productoExistente.setImagen(producto.getImagen());

                    if (categoriaId != null) {
                        Categoria categoria = categoriaRepository.findById(categoriaId)
                                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
                        productoExistente.setCategoria(categoria);
                    }

                    if (tallas != null) {
                        productoTallaRepository.deleteByProductoId(id);

                        for (ProductoTalla talla : tallas) {
                            if (talla.getTalla() != null && talla.getTalla().getId() != null) {
                                Talla tallaEntidad = tallaRepository.findById(talla.getTalla().getId())
                                        .orElseThrow(() -> new IllegalArgumentException("Talla no encontrada"));
                                talla.setTalla(tallaEntidad);
                            }
                            talla.setProducto(productoExistente);
                            productoTallaRepository.save(talla);
                        }
                    }

                    return productoRepository.save(productoExistente);
                });
    }

    public Optional<Producto> obtenerProductoPorId(Long id) {
        return productoRepository.findById(id);
    }

    public List<Producto> obtenerProductosDestacados() {
        return productoRepository.findProductosDestacados();
    }

    public List<Producto> obtenerProductosPorCategoria(Long id) {
        return productoRepository.findByCategoriaId(id);
    }

    public List<Producto> buscarPorNombre(String nombre) {
        return productoRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public List<ProductoTalla> obtenerTallasPorProducto(Long productoId) {
        return productoTallaRepository.findByProductoId(productoId);
    }
}