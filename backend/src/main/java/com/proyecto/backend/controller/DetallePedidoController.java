package com.proyecto.backend.controller;

import com.proyecto.backend.model.DetallePedido;
import com.proyecto.backend.service.DetallePedidoService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/detalles-pedido")
@Tag(name = "Detalles de Pedido", description = "Operaciones relacionadas con los detalles de pedidos")
public class DetallePedidoController {

    @Autowired
    private DetallePedidoService detallePedidoService;

    @Operation(summary = "Obtener los detalles de un pedido por su ID")
    @ApiResponse(responseCode = "200", description = "Detalles del pedido obtenidos correctamente")
    @GetMapping("/pedido/{pedidoId}")
    public List<DetallePedido> obtenerDetallesDePedido(@PathVariable Long pedidoId) {
        return detallePedidoService.obtenerDetallesDePedido(pedidoId);
    }

    @Operation(summary = "Crear un nuevo detalle de pedido")
    @ApiResponse(responseCode = "200", description = "Detalle de pedido creado correctamente")
    @PostMapping
    public ResponseEntity<DetallePedido> crearDetallePedido(@RequestBody DetallePedido detallePedido) {
        DetallePedido detallePedidoGuardado = detallePedidoService.guardarDetallePedido(detallePedido);
        return ResponseEntity.ok(detallePedidoGuardado);
    }
}
