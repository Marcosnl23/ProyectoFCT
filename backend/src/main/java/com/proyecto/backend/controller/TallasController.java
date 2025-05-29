package com.proyecto.backend.controller;

import com.proyecto.backend.model.Talla;
import com.proyecto.backend.service.TallaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tallas")
@Tag(name = "Tallas", description = "Operaciones relacionadas con las tallas de productos")
public class TallasController {

    @Autowired
    private TallaService tallaService;

    @Operation(summary = "Obtener todas las tallas")
    @ApiResponse(responseCode = "200", description = "Lista de tallas obtenida correctamente")
    @GetMapping
    public ResponseEntity<List<Talla>> getAllTallas() {
        return ResponseEntity.ok(tallaService.listarTallas());
    }

    @Operation(summary = "Obtener una talla por su ID")
    @ApiResponse(responseCode = "200", description = "Talla encontrada")
    @ApiResponse(responseCode = "404", description = "Talla no encontrada")
    @GetMapping("/{id}")
    public ResponseEntity<Talla> getTallaById(@PathVariable Long id) {
        Talla talla = tallaService.obtenerTallaPorId(id);
        if (talla == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(talla);
    }

    @Operation(summary = "Crear una nueva talla")
    @ApiResponse(responseCode = "200", description = "Talla creada correctamente")
    @PostMapping
    public ResponseEntity<Talla> createTalla(@RequestBody Talla talla) {
        return ResponseEntity.ok(tallaService.guardarTalla(talla));
    }

    @Operation(summary = "Actualizar una talla existente por ID")
    @ApiResponse(responseCode = "200", description = "Talla actualizada correctamente")
    @ApiResponse(responseCode = "404", description = "Talla no encontrada")
    @PutMapping("/{id}")
    public ResponseEntity<Talla> updateTalla(@PathVariable Long id, @RequestBody Talla talla) {
        Talla updatedTalla = tallaService.actualizarTalla(id, talla);
        if (updatedTalla == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(updatedTalla);
    }

    @Operation(summary = "Eliminar una talla por su ID")
    @ApiResponse(responseCode = "204", description = "Talla eliminada correctamente")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTalla(@PathVariable Long id) {
        tallaService.eliminarTalla(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "Obtener tallas asociadas a un producto por ID del producto")
    @ApiResponse(responseCode = "200", description = "Lista de tallas del producto obtenida correctamente")
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Talla>> getTallasByProductoId(@PathVariable Long productoId) {
        return ResponseEntity.ok(tallaService.obtenerTallasPorProductoId(productoId));
    }
}
