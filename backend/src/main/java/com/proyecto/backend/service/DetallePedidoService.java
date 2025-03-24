package com.proyecto.backend.service;

import com.proyecto.backend.model.DetallePedido;
import com.proyecto.backend.repository.DetallePedidoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DetallePedidoService {
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;

    // Obtener detalles de un pedido
    public List<DetallePedido> obtenerDetallesDePedido(Long pedidoId) {
        return detallePedidoRepository.findByPedidoId(pedidoId);
    }

    // Guardar detalles de un pedido
    public DetallePedido guardarDetallePedido(DetallePedido detallePedido) {
        return detallePedidoRepository.save(detallePedido);
    }
}

