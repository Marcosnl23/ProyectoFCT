package com.proyecto.backend.controller;

import com.proyecto.backend.model.DetallePedido;
import com.proyecto.backend.service.DetallePedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    // Obtener los detalles de un pedido
    @GetMapping("/pedido/{pedidoId}")
    public List<DetallePedido> obtenerDetallesDePedido(@PathVariable Long pedidoId) {
        return detallePedidoService.obtenerDetallesDePedido(pedidoId);
    }

    // Crear un detalle de pedido
    @PostMapping
    public ResponseEntity<DetallePedido> crearDetallePedido(@RequestBody DetallePedido detallePedido) {
        DetallePedido detallePedidoGuardado = detallePedidoService.guardarDetallePedido(detallePedido);
        return ResponseEntity.ok(detallePedidoGuardado);
    }
}

