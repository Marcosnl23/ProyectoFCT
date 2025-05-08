package com.proyecto.backend.repository;

import com.proyecto.backend.model.Pedido;
import com.proyecto.backend.model.UserInfo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    List<Pedido> findByUsuarioId(Long usuarioId); // Obtener pedidos de un usuario
    List<Pedido> findByUsuario(UserInfo usuario);
}
