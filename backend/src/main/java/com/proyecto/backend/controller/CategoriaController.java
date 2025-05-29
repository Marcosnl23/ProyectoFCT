package com.proyecto.backend.controller;

import com.proyecto.backend.model.Categoria;
import com.proyecto.backend.service.CategoriaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;

import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categorias")
@Tag(name = "Categorías", description = "API para gestionar categorías de productos")
public class CategoriaController {

    @Autowired
    private CategoriaService categoriaService;

    @Operation(summary = "Obtener lista de todas las categorías")
    @ApiResponse(responseCode = "200", description = "Lista de categorías obtenida correctamente")
    @GetMapping
    public List<Categoria> obtenerCategorias() {
        return categoriaService.listarCategorias();
    }

    @Operation(summary = "Obtener una categoría por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría encontrada"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @GetMapping("/{id}")
    public ResponseEntity<Categoria> obtenerCategoriaPorId(@PathVariable Long id) {
        Optional<Categoria> categoria = Optional.ofNullable(categoriaService.obtenerCategoriaPorId(id));
        return categoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Crear una nueva categoría")
    @ApiResponse(responseCode = "200", description = "Categoría creada correctamente")
    @PostMapping
    public ResponseEntity<Categoria> crearCategoria(@Valid @RequestBody Categoria categoria) {
        return ResponseEntity.ok(categoriaService.guardarCategoria(categoria));
    }

    @Operation(summary = "Actualizar una categoría existente por su ID")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Categoría actualizada correctamente"),
            @ApiResponse(responseCode = "404", description = "Categoría no encontrada")
    })
    @PutMapping("/{id}")
    public ResponseEntity<Categoria> actualizarCategoria(@PathVariable Long id, @Valid @RequestBody Categoria categoria) {
        Optional<Categoria> updatedCategoria = Optional.ofNullable(categoriaService.actualizarCategoria(id, categoria));
        return updatedCategoria.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @Operation(summary = "Eliminar una categoría por su ID")
    @ApiResponse(responseCode = "204", description = "Categoría eliminada correctamente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarCategoria(@PathVariable Long id) {
        categoriaService.eliminarCategoria(id);
        return ResponseEntity.noContent().build();
    }
}
