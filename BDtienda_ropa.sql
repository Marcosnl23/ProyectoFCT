DROP DATABASE IF EXISTS tienda_ropa;
CREATE DATABASE tienda_ropa;
USE tienda_ropa;

-- Tabla de usuarios
CREATE TABLE usuarios (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellidos VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL
);

-- Tabla de categorías de productos
CREATE TABLE categorias (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL UNIQUE,
    genero ENUM('Hombre', 'Mujer', 'Unisex') NOT NULL,
    imagen VARCHAR(500) NOT NULL
);

-- Tabla de productos
CREATE TABLE productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(255) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    categoria_id BIGINT,
    FOREIGN KEY (categoria_id) REFERENCES categorias(id)
);

-- Tabla de tallas
CREATE TABLE tallas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    talla VARCHAR(10) NOT NULL UNIQUE
);

-- Tabla intermedia para relacionar productos con tallas y stock
CREATE TABLE productos_tallas (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT,
    talla_id BIGINT,
    stock INT NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id),
    FOREIGN KEY (talla_id) REFERENCES tallas(id)
);

-- Tabla para almacenar múltiples imágenes por producto
CREATE TABLE imagenes_productos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    producto_id BIGINT,
    url VARCHAR(500) NOT NULL,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de carrito de compras
CREATE TABLE carrito (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de pedidos
CREATE TABLE pedidos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT,
    total DECIMAL(10,2) NOT NULL,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- Tabla de detalle de pedido
CREATE TABLE detalle_pedido (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    pedido_id BIGINT,
    producto_id BIGINT,
    cantidad INT NOT NULL,
    precio DECIMAL(10,2) NOT NULL, -- Precio en el momento de la compra
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Insertar categorías por género
INSERT INTO categorias (nombre, genero,imagen) VALUES 
('Camisetas', 'Hombre','https://static.bershka.net/assets/public/65e2/0ba0/a8a14d5a93f2/4addeef4fa20/slide_man_tshirts_-1/slide_man_tshirts_-1.jpg?ts=1743063395380&w=375&ts=20250403020005'),
('Pantalones', 'Hombre','https://static.bershka.net/assets/public/a9b2/84d9/70c24aea9c1a/10f1f1e7460a/slide_man_jeans_-1/slide_man_jeans_-1.jpg?ts=1743063391216&w=375&ts=20250403020005'),
('Sudaderas', 'Hombre','https://static.bershka.net/assets/public/866a/66fb/3ad342699bd8/bf0e06a7bb6a/slide_man_sweetshirts_-1/slide_man_sweetshirts_-1.jpg?ts=1743063393392&w=375&ts=20250403020005'),
('Vestidos', 'Mujer','https://static.bershka.net/assets/public/d2c7/d06b/799e4fa393d7/8b9ebf556221/D_slide_woman_dresses_-1/D_slide_woman_dresses_-1.jpg?ts=1743080710894&w=375&ts=20250403020005'),
('Blusas', 'Mujer','https://mivestidorazul.es/13771-large_default/blusa-mujer-videfne-rojo.jpg'),
('Faldas', 'Mujer','https://static.bershka.net/assets/public/fc0a/f46f/b05e417bbcbe/055b7b86fbb1/D_slide_woman_skirts_-1/D_slide_woman_skirts_-1.jpg?ts=1743080712559&w=375&ts=20250403020005'),
('Accesorios', 'Unisex','https://www.tradeinn.com/f/13866/138665041/garmin-reloj-fenix-7x-solar.webp');

-- Insertar tallas
INSERT INTO tallas (talla) VALUES 
('S'), ('M'), ('L'), ('XL');

-- Insertar productos con categoría y género
INSERT INTO productos (nombre, descripcion, precio, categoria_id) VALUES
('Camiseta Blanca Hombre', 'Camiseta de algodón blanca para hombre', 15.99, 1),
('Pantalón Vaquero Hombre', 'Pantalón azul para hombre', 29.99, 2),
('Sudadera Negra Hombre', 'Sudadera con capucha unisex', 39.99, 3),
('Vestido Rojo', 'Vestido elegante rojo para mujer', 49.99, 4),
('Reloj Unisex', 'Reloj de acero inoxidable para cualquier género', 99.99, 7);

-- Insertar stock de productos por talla
INSERT INTO productos_tallas (producto_id, talla_id, stock) VALUES
(1, 1, 20), -- Camiseta Blanca Hombre - Talla S
(1, 2, 15), -- Camiseta Blanca Hombre - Talla M
(1, 3, 10), -- Camiseta Blanca Hombre - Talla L
(2, 2, 25), -- Pantalón Vaquero Hombre - Talla M
(2, 3, 20), -- Pantalón Vaquero Hombre - Talla L
(3, 3, 30), -- Sudadera Negra Hombre - Talla L
(3, 4, 20), -- Sudadera Negra Hombre - Talla XL
(4, 1, 12), -- Vestido Rojo - Talla S
(4, 2, 10); -- Vestido Rojo - Talla M

-- Insertar imágenes de productos
INSERT INTO imagenes_productos (producto_id, url) VALUES
(1, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/09153595-4d87-47ec-b887-9f9ece5e6bad/M+NK+DF+STRK+TOP+SS.png'),
(1, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/0d99d5a6-0ddf-45ac-9c2d-6d55e9820165/M+NK+DF+STRK+TOP+SS.png'),
(2, 'https://static.bershka.net/assets/public/fbcc/5f52/b7854292bcc9/cb5ef0e5f4ea/00333220400-a4o/00333220400-a4o.jpg?ts=1742561258403&w=800'),
(2, 'https://static.bershka.net/assets/public/b80d/1dac/d32840c19297/a30b2d5bbafc/00333220400-b/00333220400-b.jpg?ts=1742561258241&w=800'),
(3, 'https://static.bershka.net/assets/public/bf92/7cc0/e9b54939bcb3/df6d22d761ab/07368498800-p/07368498800-p.jpg?ts=1719397734546&w=800'),
(3, 'https://static.bershka.net/assets/public/a37a/6165/0c9e457f9ec6/ae9e57b4c451/07368498800-a1t/07368498800-a1t.jpg?ts=1719397704062&w=800'),
(4, 'https://img.guess.com/image/upload/f_auto,q_auto,fl_strip_profile,e_sharpen:50,w_1920,c_scale,dpr_auto/v1/EU/Style/ECOMM/W5RK07Z2YJ2-A51D'),
(5, 'https://www.tradeinn.com/f/13866/138665041/garmin-reloj-fenix-7x-solar.webp'),
(5, 'https://www.tradeinn.com/f/13866/138665041_2/garmin-reloj-fenix-7x-solar.webp');

-- Consultas de prueba
SELECT * FROM usuarios;
SELECT * FROM productos;
SELECT * FROM categorias;
SELECT * FROM tallas;
SELECT * FROM productos_tallas;
SELECT * FROM imagenes_productos;
SELECT * FROM carrito;
SELECT * FROM pedidos;
SELECT * FROM detalle_pedido;

-- Eliminar un usuario de prueba
DELETE FROM usuarios WHERE id = 2;


