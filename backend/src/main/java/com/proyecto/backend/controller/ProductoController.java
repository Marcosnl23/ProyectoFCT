package com.proyecto.backend.controller;

import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.model.Talla;
import com.proyecto.backend.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoService.listarProductos();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/destacados")
    public List<Producto> obtenerProductosDestacados() {
        return productoService.obtenerProductosDestacados();
    }

    @PostMapping
    public ResponseEntity<Producto> guardarProducto(@RequestBody Map<String, Object> payload) {
        Producto producto = new Producto();
        producto.setNombre((String) payload.get("nombre"));
        producto.setPrecio(Double.valueOf(payload.get("precio").toString()));
        producto.setDescripcion((String) payload.get("descripcion"));
        producto.setImagen((String) payload.get("imagen"));

        Long categoriaId = Long.valueOf(payload.get("categoriaId").toString());
        List<Map<String, Object>> tallasPayload = (List<Map<String, Object>>) payload.get("tallas");

        List<ProductoTalla> tallas = tallasPayload.stream().map(tallaPayload -> {
            ProductoTalla talla = new ProductoTalla();
            talla.setStock(Integer.valueOf(tallaPayload.get("stock").toString()));
            Talla tallaEntidad = new Talla();
            tallaEntidad.setId(Long.valueOf(tallaPayload.get("tallaId").toString()));
            talla.setTalla(tallaEntidad);
            return talla;
        }).collect(Collectors.toList());

        Producto productoGuardado = productoService.guardarProducto(producto, categoriaId, tallas);
        return ResponseEntity.ok(productoGuardado);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Producto> actualizarProducto(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        Producto producto = new Producto();
        producto.setNombre((String) payload.get("nombre"));
        producto.setPrecio(Double.valueOf(payload.get("precio").toString()));
        producto.setDescripcion((String) payload.get("descripcion"));
        producto.setImagen((String) payload.get("imagen"));

        Long categoriaId = Long.valueOf(payload.get("categoriaId").toString());
        List<Map<String, Object>> tallasPayload = (List<Map<String, Object>>) payload.get("tallas");

        List<ProductoTalla> tallas = tallasPayload.stream().map(tallaPayload -> {
            ProductoTalla talla = new ProductoTalla();
            talla.setStock(Integer.valueOf(tallaPayload.get("stock").toString()));
            Talla tallaEntidad = new Talla();
            tallaEntidad.setId(Long.valueOf(tallaPayload.get("tallaId").toString()));
            talla.setTalla(tallaEntidad);
            return talla;
        }).collect(Collectors.toList());

        Optional<Producto> productoActualizado = productoService.actualizarProducto(id, producto, categoriaId, tallas);
        return productoActualizado.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    
    @GetMapping("/categoria/{id}")
    public List<Producto> obtenerProductosPorCategoria(@PathVariable Long id) {
        return productoService.obtenerProductosPorCategoria(id);
    }

    @GetMapping(params = "nombre")
    public List<Producto> buscarProductosPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }


}