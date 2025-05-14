package com.proyecto.backend.service;

import com.proyecto.backend.model.DetallePedido;
import com.proyecto.backend.model.Pedido;
import com.proyecto.backend.model.UserInfo;
import com.proyecto.backend.repository.PedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import com.proyecto.backend.repository.UserInfoRepository;

@Service
public class PedidoService {

    @Autowired
    private UserInfoRepository userInfoRepository;

    @Autowired
    private PedidoRepository pedidoRepository;

    @Autowired
    private ProductoTallaService productoTallaService;

    public List<Pedido> listarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public Pedido crearPedido(Pedido pedido) {
        // Validar que la lista de detalles no sea nula ni vacía
        if (pedido.getDetalles() == null || pedido.getDetalles().isEmpty()) {
            throw new IllegalArgumentException("El pedido debe contener al menos un detalle.");
        }

        for (DetallePedido detalle : pedido.getDetalles()) {
            // Validar que los objetos producto y talla existen, y que contienen ID
            if (detalle.getProducto() == null || detalle.getProducto().getId() == null) {
                throw new IllegalArgumentException("Cada detalle debe tener un producto con ID.");
            }
            if (detalle.getTalla() == null || detalle.getTalla().getId() == null) {
                throw new IllegalArgumentException("Cada detalle debe tener una talla con ID.");
            }
            if (detalle.getCantidad() == null || detalle.getCantidad() <= 0) {
                throw new IllegalArgumentException("Cada detalle debe tener una cantidad válida.");
            }

            productoTallaService.reducirStock(
                    detalle.getProducto().getId(),
                    detalle.getTalla().getId(),
                    detalle.getCantidad()
            );
        }

        return pedidoRepository.save(pedido);
    }


    public List<Pedido> obtenerPedidosDeUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public List<Pedido> obtenerPedidosDeUsuarioPorUsername(String username) {
        UserInfo usuario = userInfoRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        return pedidoRepository.findByUsuario(usuario);
    }
}
