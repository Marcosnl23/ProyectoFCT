package com.proyecto.backend.controller;

import com.proyecto.backend.model.Pedido;
import com.proyecto.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    // Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Pedido pedido) {
        Pedido pedidoCreado = pedidoService.crearPedido(pedido);
        return ResponseEntity.ok(pedidoCreado);
    }

    // Obtener todos los pedidos de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPedidosDeUsuario(@PathVariable Long usuarioId) {
        return pedidoService.obtenerPedidosDeUsuario(usuarioId);
    }
}

