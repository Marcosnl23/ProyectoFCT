package com.proyecto.backend.controller;

import com.proyecto.backend.model.Carrito;
import com.proyecto.backend.service.CarritoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/carrito")
public class CarritoController {

    @Autowired
    private CarritoService carritoService;

    // Obtener el carrito de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Carrito> obtenerCarritoDeUsuario(@PathVariable Long usuarioId) {
        return carritoService.obtenerCarritoDeUsuario(usuarioId);
    }

    // Agregar un producto al carrito
    @PostMapping
    public ResponseEntity<Carrito> agregarAlCarrito(@RequestBody Carrito carrito) {
        Carrito carritoGuardado = carritoService.agregarAlCarrito(carrito);
        return ResponseEntity.ok(carritoGuardado);
    }

    // Eliminar un producto del carrito
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminarDelCarrito(@PathVariable Long id) {
        carritoService.eliminarDelCarrito(id);
        return ResponseEntity.noContent().build();
    }
}

