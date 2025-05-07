package com.proyecto.backend.controller;

import com.proyecto.backend.model.Pedido;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.proyecto.backend.repository.UserInfoRepository;
import java.util.Map;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;
    @Autowired
    private UserInfoRepository userInfoRepository;

    // Crear un nuevo pedido
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Double total = Double.valueOf(payload.get("total").toString());
        String fechaStr = (String) payload.get("fecha"); // Fecha opcional

        // Buscar el usuario por su username
        UserInfo usuario = userInfoRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        // Crear el pedido
        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setTotal(total);

        // Si se envía una fecha, usarla; de lo contrario, usar la fecha actual
        if (fechaStr != null) {
            pedido.setFecha(LocalDateTime.parse(fechaStr)); // Asegúrate de que el formato sea compatible
        } else {
            pedido.setFecha(LocalDateTime.now());
        }

        Pedido pedidoCreado = pedidoService.crearPedido(pedido);
        return ResponseEntity.ok(pedidoCreado);
    }

    // Obtener todos los pedidos de un usuario
    @GetMapping("/usuario/{usuarioId}")
    public List<Pedido> obtenerPedidosDeUsuario(@PathVariable Long usuarioId) {
        return pedidoService.obtenerPedidosDeUsuario(usuarioId);
    }
}
