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
    imagen VARCHAR(500),
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
    precio DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- Tabla de favoritos
CREATE TABLE favoritos (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    producto_id BIGINT NOT NULL,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE CASCADE,
    UNIQUE (usuario_id, producto_id) -- Evitar duplicados
);

-- Tabla de valoraciones generales de usuarios
CREATE TABLE valoraciones_generales (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    usuario_id BIGINT NOT NULL,
    puntuacion INT NOT NULL CHECK (puntuacion >= 1 AND puntuacion <= 5),
    comentario TEXT,
    fecha TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
    UNIQUE (usuario_id) -- Un usuario solo puede dejar una valoración general
);


-- Insertar categorías
INSERT INTO categorias (nombre, genero, imagen) VALUES 
('Camisetas', 'Hombre','https://static.bershka.net/assets/public/65e2/0ba0/a8a14d5a93f2/4addeef4fa20/slide_man_tshirts_-1/slide_man_tshirts_-1.jpg?ts=1743063395380'),
('Pantalones', 'Hombre','https://static.bershka.net/assets/public/a9b2/84d9/70c24aea9c1a/10f1f1e7460a/slide_man_jeans_-1/slide_man_jeans_-1.jpg?ts=1743063391216'),
('Sudaderas', 'Hombre','https://static.bershka.net/assets/public/866a/66fb/3ad342699bd8/bf0e06a7bb6a/slide_man_sweetshirts_-1/slide_man_sweetshirts_-1.jpg?ts=1743063393392'),
('Vestidos', 'Mujer','https://static.bershka.net/assets/public/d2c7/d06b/799e4fa393d7/8b9ebf556221/D_slide_woman_dresses_-1.jpg'),
('Blusas', 'Mujer','https://mivestidorazul.es/13771-large_default/blusa-mujer-videfne-rojo.jpg'),
('Faldas', 'Mujer','https://static.bershka.net/assets/public/fc0a/f46f/b05e417bbcbe/055b7b86fbb1/D_slide_woman_skirts_-1.jpg'),
('Accesorios', 'Unisex','https://www.tradeinn.com/f/13866/138665041/garmin-reloj-fenix-7x-solar.webp');

-- Insertar tallas
INSERT INTO tallas (talla) VALUES ('S'), ('M'), ('L'), ('XL');

-- Insertar productos
INSERT INTO productos (nombre, descripcion, precio, categoria_id, imagen) VALUES
('Camiseta Blanca Hombre', 'Camiseta de algodón blanca para hombre', 15.99, 1, 'https://static.nike.com/a/images/t_PDP_1728_v1/f_auto,q_auto:eco/09153595-4d87-47ec-b887-9f9ece5e6bad/M+NK+DF+STRK+TOP+SS.png'),
('Pantalón Vaquero Hombre', 'Pantalón azul para hombre', 29.99, 2, 'https://static.bershka.net/assets/public/fbcc/5f52/b7854292bcc9/cb5ef0e5f4ea/00333220400-a4o.jpg'),
('Sudadera Negra Hombre', 'Sudadera con capucha unisex', 39.99, 3, 'https://static.bershka.net/assets/public/bf92/7cc0/e9b54939bcb3/df6d22d761ab/07368498800-p.jpg'),
('Vestido Rojo', 'Vestido elegante rojo para mujer', 49.99, 4, 'https://img.guess.com/image/upload/f_auto,q_auto,fl_strip_profile,e_sharpen:50,w_1920/v1/EU/Style/ECOMM/W5RK07Z2YJ2-A51D'),
('Reloj Unisex', 'Reloj de acero inoxidable para cualquier género', 99.99, 7, 'https://www.tradeinn.com/f/13866/138665041/garmin-reloj-fenix-7x-solar.webp'),
('Camiseta Negra Hombre', 'Camiseta básica negra de algodón para hombre', 14.99, 1, 'https://static.nike.com/a/images/t_default/edfa8c5f-d07a-42a3-9f6f-57d51f8c61df/dri-fit-mens-training-t-shirt-nX2C2k.png'),
('Pantalón Chino Beige', 'Pantalón chino color beige, ideal para uso casual', 34.99, 2, 'https://static.pullandbear.net/2/photos//2023/I/0/2/p/4695/506/710/4695506710_2_1_8.jpg'),
('Sudadera Blanca Oversize', 'Sudadera oversize con cuello redondo y diseño minimalista', 42.99, 3, 'https://static.zara.net/photos///2023/I/0/2/p/0962/410/250/2/w/1126/0962410250_1_1_1.jpg'),
('Vestido Verde', 'Vestido midi de tirantes, ideal para el verano', 39.99, 4, 'https://static.zara.net/photos///2023/I/0/1/p/5030/244/500/2/w/750/5030244500_1_1_1.jpg'),
('Blusa Floral Mujer', 'Blusa con estampado floral y mangas abullonadas', 25.99, 5, 'https://mango.com/images/1340/13/mujer_blusa_floral.jpg'),
('Falda Plisada Negra', 'Falda plisada con cintura alta en color negro', 29.99, 6, 'https://static.pullandbear.net/2/photos//2023/I/0/1/p/5393/515/800/5393515800_2_1_8.jpg'),
('Gorra Negra Unisex', 'Gorra deportiva unisex con logo bordado', 19.99, 7, 'https://assets.adidas.com/images/w_600,f_auto,q_auto/f0f7908e84174db380e1adf000d65a87_9366/Gorra_Baseball_3_Tiras_Negro_HK9924_01_standard.jpg');

-- Insertar stock de productos por talla
INSERT INTO productos_tallas (producto_id, talla_id, stock) VALUES
(1, 1, 20), (1, 2, 15), (1, 3, 10),
(2, 2, 25), (2, 3, 20),
(3, 3, 30), (3, 4, 20),
(4, 1, 12), (4, 2, 10),
(6, 2, 18), (6, 3, 12),
(7, 2, 20), (7, 3, 15),
(8, 3, 22),
(9, 1, 10), (9, 2, 8),
(10, 2, 14), (10, 3, 10),
(11, 1, 9), (11, 2, 6),
(12, 2, 25), (12, 3, 18);

-- Ejemplo: Insertar usuarios (mínimo para que funcionen las valoraciones)
INSERT INTO usuarios (nombre, apellidos, username, email, password, rol) VALUES
('Juan', 'Pérez', 'juanp', 'juanp@mail.com', 'hashedpassword1', 'USER'),
('María', 'González', 'mariag', 'mariag@mail.com', 'hashedpassword2', 'USER'),
('Carlos', 'López', 'carlosl', 'carlosl@mail.com', 'hashedpassword3', 'USER');

-- Insertar valoraciones generales de ejemplo
INSERT INTO valoraciones_generales (usuario_id, puntuacion, comentario) VALUES
(1, 5, 'Me encanta la calidad y el envío fue rapidísimo.'),
(2, 4, 'Muy buena atención al cliente y productos cómodos.'),
(3, 3, 'Calidad aceptable pero podrían mejorar la variedad de tallas.');
-- Consultas de prueba
SELECT * FROM usuarios;
SELECT * FROM productos;
SELECT * FROM categorias;
SELECT * FROM tallas;
SELECT * FROM productos_tallas;
SELECT * FROM pedidos;
SELECT * FROM detalle_pedido;
SELECT * FROM favoritos;

UPDATE usuarios SET rol = 'ADMIN' WHERE id = '1';

ALTER TABLE detalle_pedido
ADD COLUMN talla_id BIGINT,
ADD FOREIGN KEY (talla_id) REFERENCES tallas(id);

