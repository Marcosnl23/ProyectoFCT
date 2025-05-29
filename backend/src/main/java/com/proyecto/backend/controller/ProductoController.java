package com.proyecto.backend.controller;

import com.proyecto.backend.model.Producto;
import com.proyecto.backend.model.ProductoTalla;
import com.proyecto.backend.model.Talla;
import com.proyecto.backend.service.ProductoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/productos")
@Tag(name = "Productos", description = "Operaciones relacionadas con productos")
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @Operation(summary = "Obtener todos los productos")
    @ApiResponse(responseCode = "200", description = "Lista de productos obtenida correctamente")
    @GetMapping
    public List<Producto> obtenerProductos() {
        return productoService.listarProductos();
    }

    @Operation(summary = "Obtener un producto por su ID")
    @ApiResponse(responseCode = "200", description = "Producto encontrado")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<Producto> obtenerProductoPorId(@PathVariable Long id) {
        Optional<Producto> producto = productoService.obtenerProductoPorId(id);
        return producto.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Obtener productos destacados")
    @ApiResponse(responseCode = "200", description = "Lista de productos destacados obtenida correctamente")
    @GetMapping("/destacados")
    public List<Producto> obtenerProductosDestacados() {
        return productoService.obtenerProductosDestacados();
    }

    @Operation(summary = "Crear un nuevo producto con tallas y stock")
    @ApiResponse(responseCode = "200", description = "Producto creado correctamente")
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

    @Operation(summary = "Actualizar un producto existente por ID")
    @ApiResponse(responseCode = "200", description = "Producto actualizado correctamente")
    @ApiResponse(responseCode = "404", description = "Producto no encontrado")
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

    @Operation(summary = "Eliminar un producto por su ID")
    @ApiResponse(responseCode = "204", description = "Producto eliminado correctamente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarProducto(@PathVariable Long id) {
        productoService.eliminarProducto(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener productos por ID de categoría")
    @ApiResponse(responseCode = "200", description = "Lista de productos filtrados por categoría")
    @GetMapping("/categoria/{id}")
    public List<Producto> obtenerProductosPorCategoria(@PathVariable Long id) {
        return productoService.obtenerProductosPorCategoria(id);
    }

    @Operation(summary = "Buscar productos por nombre")
    @ApiResponse(responseCode = "200", description = "Lista de productos que coinciden con el nombre buscado")
    @GetMapping(params = "nombre")
    public List<Producto> buscarProductosPorNombre(@RequestParam String nombre) {
        return productoService.buscarPorNombre(nombre);
    }

}
