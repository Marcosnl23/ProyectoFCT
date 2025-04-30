package com.proyecto.backend.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "productos_tallas")
@Getter @Setter
public class ProductoTalla {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "producto_id")
    private Producto producto;

    @ManyToOne
    @JoinColumn(name = "talla_id")
    private Talla talla;

    private int stock;

    public ProductoTalla(Long id, Producto producto, Talla talla, int stock) {
        this.id = id;
        this.producto = producto;
        this.talla = talla;
        this.stock = stock;
    }

    public ProductoTalla() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Producto getProducto() {
        return producto;
    }

    public void setProducto(Producto producto) {
        this.producto = producto;
    }

    public Talla getTalla() {
        return talla;
    }

    public void setTalla(Talla talla) {
        this.talla = talla;
    }

    public int getStock() {
        return stock;
    }

    public void setStock(int stock) {
        this.stock = stock;
    }
}

