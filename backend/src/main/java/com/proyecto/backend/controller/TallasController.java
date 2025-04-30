package com.proyecto.backend.controller;

import com.proyecto.backend.model.Talla;
import com.proyecto.backend.service.TallaService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tallas")
public class TallasController {

    @Autowired
    private TallaService tallaService;

    // Obtener todas las tallas
    @GetMapping
    public ResponseEntity<List<Talla>> getAllTallas() {
        return ResponseEntity.ok(tallaService.listarTallas());
    }

    // Obtener una talla por ID
    @GetMapping("/{id}")
    public ResponseEntity<Talla> getTallaById(@PathVariable Long id) {
        return ResponseEntity.ok(tallaService.obtenerTallaPorId(id));
    }

    // Crear una nueva talla
    @PostMapping
    public ResponseEntity<Talla> createTalla(@RequestBody Talla talla) {
        return ResponseEntity.ok(tallaService.guardarTalla(talla));
    }

    // Actualizar una talla existente
    @PutMapping("/{id}")
    public ResponseEntity<Talla> updateTalla(@PathVariable Long id, @RequestBody Talla talla) {
        return ResponseEntity.ok(tallaService.actualizarTalla(id, talla));
    }

    // Eliminar una talla
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTalla(@PathVariable Long id) {
        tallaService.eliminarTalla(id);
        return ResponseEntity.noContent().build();
    }

    // Obtener tallas por ID de producto
    @GetMapping("/producto/{productoId}")
    public ResponseEntity<List<Talla>> getTallasByProductoId(@PathVariable Long productoId) {
        return ResponseEntity.ok(tallaService.obtenerTallasPorProductoId(productoId));
    }
}