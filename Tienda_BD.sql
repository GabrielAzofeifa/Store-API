CREATE TYPE estado_compra AS ENUM ('pendiente', 'en proceso', 'completado', 'cancelado');


CREATE TABLE api_users (
	id SERIAL PRIMARY KEY, 
	email VARCHAR(255) UNIQUE NOT NULL,
	password VARCHAR (255) NOT NULL, 
	creation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

create table categorias
(
	id_categoria serial primary key,
	descripcion varchar(100)
);

create table usuarios
(
	id_usuario serial primary key,
	nombre varchar(100) not null,
	apellido varchar(100),
	edad int,
	telefono varchar(20)
);

create table productos
(
	id_producto serial primary key,
	nombre varchar(100) not null,
	precio numeric(10,2),
	cantidad int,
	marca varchar(30),
	fecha_emision date,
	fecha_vencimiento date,
	id_categoria int,
    FOREIGN KEY (id_categoria) REFERENCES categorias(id_categoria)
);



create table proveedores
(
	id_proveedor serial primary key,
	nombre varchar(100) not null,
	telefono varchar(20)
);

create table compras
(
	id_compra serial primary key,
	fecha_compra date,
	total decimal(10,2),
	estado estado_compra DEFAULT 'pendiente',
	id_proveedor int,
    id_usuario int,
	id_producto INT,
    cantidad INT,
    FOREIGN KEY (id_proveedor) REFERENCES proveedores(id_proveedor),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
	FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);

CREATE TABLE usuarios_Login (
    id_usuario SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    creado_en TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Borramos la anterior por si acaso y creamos la corregida
CREATE OR REPLACE VIEW vista_inventario_completo AS
SELECT 
    p.nombre, 
    c.descripcion AS categoria -- Cambiamos nombre_categoria por descripcion
FROM productos p
INNER JOIN categorias c ON p.id_categoria = c.id_categoria;

INSERT INTO productos (nombre, precio, cantidad, marca, fecha_emision, fecha_vencimiento)
VALUES ('Pan cuadrado', 1.50, 20, 'BIMBO', '2026-03-01', '2026-03-10');

INSERT INTO categorias (descripcion)
VALUES ('Panadería'), ('Bebidas');

INSERT INTO proveedores (nombre, telefono)
VALUES ('BIMBO', '2222-3333');

INSERT INTO usuarios (nombre, apellido, edad, telefono)
VALUES ('Carlos', 'A', '18', '72732743');

INSERT INTO usuarios_Login (nombre, email, password_hash)
VALUES ('Gabriel', 'Azo@gmail.com', 'hash_prueba');


select * from productos;
select * from categorias;
select * from proveedores;
select * from compras;
select * from usuarios;
SELECT * FROM vista_inventario_completo;