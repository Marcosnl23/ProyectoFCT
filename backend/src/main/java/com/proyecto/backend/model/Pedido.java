package com.proyecto.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "pedidos")
@Getter @Setter
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserInfo usuario;

    private Double total;

    private LocalDateTime fecha = LocalDateTime.now();

    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL)
    private List<DetallePedido> detalles;

    public Pedido(UserInfo usuario, Double total, List<DetallePedido> detalles) {
        this.usuario = usuario;
        this.total = total;
        this.detalles = detalles;
    }

    public Pedido(Long id, UserInfo usuario, Double total, List<DetallePedido> detalles) {
        this.id = id;
        this.usuario = usuario;
        this.total = total;
        this.detalles = detalles;
    }

    public Pedido(){

    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public UserInfo getUsuario() {
        return usuario;
    }

    public void setUsuario(UserInfo usuario) {
        this.usuario = usuario;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public LocalDateTime getFecha() {
        return fecha;
    }

    public void setFecha(LocalDateTime fecha) {
        this.fecha = fecha;
    }

    public List<DetallePedido> getDetalles() {
        return detalles;
    }

    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
}
