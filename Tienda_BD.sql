CREATE TYPE estado_compra AS ENUM ('pendiente', 'en proceso', 'completado', 'cancelado');

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



INSERT INTO productos (nombre, precio, cantidad, marca, fecha_emision, fecha_vencimiento)
VALUES ('Pan cuadrado', 1.50, 20, 'BIMBO', '2026-03-01', '2026-03-10');

INSERT INTO categorias (descripcion)
VALUES ('Panadería'), ('Bebidas');

INSERT INTO proveedores (nombre, telefono)
VALUES ('BIMBO', '2222-3333');

INSERT INTO usuarios (nombre, apellido)
VALUES ('Carlos', 'Admin');


select * from productos;
select * from categorias;
select * from proveedores;
select * from compras;
select * from usuarios;
