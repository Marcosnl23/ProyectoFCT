package com.proyecto.backend.controller;

import com.proyecto.backend.model.*;
import com.proyecto.backend.repository.ProductoRepository;
import com.proyecto.backend.repository.TallaRepository;
import com.proyecto.backend.repository.UserInfoRepository;
import com.proyecto.backend.service.PedidoService;
import com.proyecto.backend.service.JwtService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@Tag(name = "Pedidos", description = "Operaciones relacionadas con los pedidos")
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private ProductoRepository productoRepository;

    @Autowired
    private TallaRepository tallaRepository;

    @Autowired
    private JwtService jwtService;

    @Operation(summary = "Crear un nuevo pedido con sus detalles")
    @ApiResponse(responseCode = "200", description = "Pedido creado correctamente")
    @ApiResponse(responseCode = "400", description = "Error en los datos de entrada")
    @PostMapping
    public ResponseEntity<Pedido> crearPedido(@RequestBody Map<String, Object> payload) {
        String username = (String) payload.get("username");
        Double total = Double.valueOf(payload.get("total").toString());
        String fechaStr = (String) payload.get("fecha");

        UserInfo usuario = userInfoRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Pedido pedido = new Pedido();
        pedido.setUsuario(usuario);
        pedido.setTotal(total);
        pedido.setFecha(fechaStr != null ? LocalDateTime.parse(fechaStr) : LocalDateTime.now());

        // Procesar detalles
        List<Map<String, Object>> detallesPayload = (List<Map<String, Object>>) payload.get("detalles");
        List<DetallePedido> detalles = new ArrayList<>();

        for (Map<String, Object> detalleData : detallesPayload) {
            Number productoIdNum = (Number) detalleData.get("productoId");
            Long productoId = productoIdNum.longValue();

            Producto producto = productoRepository.findById(productoId)
                    .orElseThrow(() -> new RuntimeException("Producto no encontrado"));

            Number tallaIdNum = (Number) detalleData.get("tallaId");
            Long tallaId = tallaIdNum.longValue();

            Talla talla = tallaRepository.findById(tallaId)
                    .orElseThrow(() -> new RuntimeException("Talla no encontrada"));

            Integer cantidad = ((Number) detalleData.get("cantidad")).intValue();
            Double precio = Double.valueOf(detalleData.get("precio").toString());

            DetallePedido detalle = new DetallePedido();
            detalle.setPedido(pedido);
            detalle.setProducto(producto);
            detalle.setTalla(talla);
            detalle.setCantidad(cantidad);
            detalle.setPrecio(precio);

            detalles.add(detalle);
        }

        pedido.setDetalles(detalles);

        Pedido pedidoGuardado = pedidoService.crearPedido(pedido);

        return ResponseEntity.ok(pedidoGuardado);
    }

    @Operation(summary = "Obtener todos los pedidos del usuario autenticado")
    @ApiResponse(responseCode = "200", description = "Lista de pedidos del usuario devuelta correctamente")
    @GetMapping("/usuario")
    public List<Pedido> obtenerPedidosDeUsuario(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "").trim();
        String username = jwtService.extractUsername(token);
        return pedidoService.obtenerPedidosDeUsuarioPorUsername(username);
    }

    @Operation(summary = "Obtener todos los pedidos (solo admin)")
    @ApiResponse(responseCode = "200", description = "Lista completa de pedidos devuelta correctamente")
    @GetMapping("/all")
    public ResponseEntity<List<Pedido>> obtenerTodosLosPedidos() {
        List<Pedido> pedidos = pedidoService.obtenerTodosLosPedidos();
        return ResponseEntity.ok(pedidos);
    }
}
