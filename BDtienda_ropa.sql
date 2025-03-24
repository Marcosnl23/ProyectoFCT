create database tienda_ropa;

use tienda_ropa;

CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL
);

CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL,
    imagen_url VARCHAR(500) -- URL de la imagen
);

CREATE TABLE carrito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE detalle_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL, -- Precio en el momento de la compra
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar usuarios
INSERT INTO usuarios (nombre, email, password) VALUES
('Juan Pérez', 'juan@example.com', 'clave123'),
('María López', 'maria@example.com', 'password456');

-- Insertar productos (ropa)
INSERT INTO productos (nombre, descripcion, precio, stock, imagen_url) VALUES
('Camiseta Blanca', 'Camiseta de algodón blanca para hombre', 15.99, 50, 'https://example.com/camiseta-blanca.jpg'),
('Pantalón Vaquero', 'Pantalón azul para mujer', 29.99, 30, 'https://example.com/pantalon-vaquero.jpg'),
('Sudadera Negra', 'Sudadera con capucha unisex', 39.99, 20, 'https://example.com/sudadera-negra.jpg');

-- Insertar productos en el carrito (usuario Juan agrega productos)
INSERT INTO carrito (usuario_id, producto_id, cantidad) VALUES
(1, 1, 2),  -- Juan compró 2 camisetas blancas
(1, 2, 1);  -- Juan compró 1 pantalón vaquero

-- Insertar pedido de Juan
INSERT INTO pedidos (usuario_id, total, fecha) VALUES
(1, 61.97, NOW());  -- Total = (2 * 15.99) + (1 * 29.99)

-- Insertar detalles del pedido
INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio) VALUES
(1, 1, 2, 15.99),  -- 2 camisetas blancas
(1, 2, 1, 29.99);  -- 1 pantalón vaquero

select * from usuarios;
select * from productos;
select * from carrito;
select * from pedidos;
select * from detalle_pedido;

