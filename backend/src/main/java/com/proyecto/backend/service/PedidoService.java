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

    public List<Pedido> listarPedidosPorUsuario(Long usuarioId) {
        return pedidoRepository.findByUsuarioId(usuarioId);
    }

    public Pedido guardarPedido(Pedido pedido) {
        return pedidoRepository.save(pedido);
    }

    public Pedido crearPedido(Pedido pedido) {
        // Asignar el pedido a cada detalle
        for (DetallePedido detalle : pedido.getDetalles()) {
            detalle.setPedido(pedido);
        }

        // Guardar el pedido (esto también guardará los detalles debido a
        // CascadeType.ALL)
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
