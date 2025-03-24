INSERT INTO CATEGORIA (DESCRIPCION_CATEGORIA) VALUES 
('Categoría Prueba A'),
('Categoría Prueba B'),
('Categoría Prueba C'),
('Categoría Prueba D');

INSERT INTO PRODUCTO (ID_CATEGORIA_PRODUCTO, NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO, PRECIOVENTAACT_PRODUCTO, COSTOVENTA_PRODUCTO, MARGENUTILIDAD_PRODUCTO, VALORIVA_PRODUCTO) VALUES 
(1, 'Producto Prueba A', 'Descripción del Producto Prueba A', 10000, 8000, 2000, 0.19),
(1, 'Producto Prueba B', 'Descripción del Producto Prueba B', 11000, 8500, 2500, 0.19),
(1, 'Producto Prueba C', 'Descripción del Producto Prueba C', 12000, 9000, 3000, 0.19),
(1, 'Producto Prueba D', 'Descripción del Producto Prueba D', 13000, 9500, 3500, 0.19),
(2, 'Producto Prueba E', 'Descripción del Producto Prueba E', 14000, 10000, 4000, 0.19),
(2, 'Producto Prueba F', 'Descripción del Producto Prueba F', 15000, 10500, 4500, 0.19),
(2, 'Producto Prueba G', 'Descripción del Producto Prueba G', 16000, 11000, 5000, 0.19),
(2, 'Producto Prueba H', 'Descripción del Producto Prueba H', 17000, 11500, 5500, 0.19),
(2, 'Producto Prueba I', 'Descripción del Producto Prueba I', 18000, 12000, 6000, 0.19),
(3, 'Producto Prueba J', 'Descripción del Producto Prueba J', 19000, 12500, 6500, 0.19),
(3, 'Producto Prueba K', 'Descripción del Producto Prueba K', 20000, 13000, 7000, 0.19),
(3, 'Producto Prueba L', 'Descripción del Producto Prueba L', 21000, 13500, 7500, 0.19),
(3, 'Producto Prueba M', 'Descripción del Producto Prueba M', 22000, 14000, 8000, 0.19),
(3, 'Producto Prueba N', 'Descripción del Producto Prueba N', 23000, 14500, 8500, 0.19),
(4, 'Producto Prueba O', 'Descripción del Producto Prueba O', 24000, 15000, 9000, 0.19),
(4, 'Producto Prueba P', 'Descripción del Producto Prueba P', 25000, 15500, 9500, 0.19),
(4, 'Producto Prueba Q', 'Descripción del Producto Prueba Q', 26000, 16000, 10000, 0.19),
(4, 'Producto Prueba R', 'Descripción del Producto Prueba R', 27000, 16500, 10500, 0.19),
(4, 'Producto Prueba S', 'Descripción del Producto Prueba S', 28000, 17000, 11000, 0.19),
(4, 'Producto Prueba T', 'Descripción del Producto Prueba T', 29000, 17500, 11500, 0.19),
(4, 'Producto Prueba U', 'Descripción del Producto Prueba U', 30000, 18000, 12000, 0.19),
(4, 'Producto Prueba V', 'Descripción del Producto Prueba V', 31000, 18500, 12500, 0.19),
(4, 'Producto Prueba W', 'Descripción del Producto Prueba W', 32000, 19000, 13000, 0.19),
(4, 'Producto Prueba X', 'Descripción del Producto Prueba X', 33000, 19500, 13500, 0.19),
(4, 'Producto Prueba Y', 'Descripción del Producto Prueba Y', 34000, 20000, 14000, 0.19),
(4, 'Producto Prueba Z', 'Descripción del Producto Prueba Z', 35000, 20500, 14500, 0.19);

INSERT INTO SEDE (NOMBRE_SEDE, ID_CIUDAD_SEDE, DIRECCION_SEDE, NUMEROEMPLEADOS_SEDE, TELEFONO_SEDE) VALUES 
('Sede Centro', 11.001, 'Carrera 1 #1-1', 1, '6011234567'),
('Sede Norte', 11.001, 'Avenida 7 #7-7', 2, '6017654321'),
('Sede Sur', 11.001, 'Calle 12 #12-12', 1, '6019876543');

INSERT INTO INVENTARIO (ID_PRODUCTO_INVENTARIO, EXISTENCIA_INVENTARIO) VALUES
(1, 100), (2, 120), (3, 80), (4, 150), (5, 90),
(6, 200), (7, 110), (8, 95), (9, 130), (10, 75),
(11, 60), (12, 180), (13, 170), (14, 140), (15, 160),
(16, 125), (17, 135), (18, 145), (19, 155), (20, 165),
(21, 175), (22, 185), (23, 195), (24, 205), (25, 215),
(26, 225);


INSERT INTO INVENTARIOLOCAL (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL) VALUES

(1, 1, 30, 10, 50), (4, 1, 40, 15, 60), (7, 1, 20, 5, 40),
(10, 1, 35, 10, 55), (13, 1, 45, 15, 65), (16, 1, 25, NULL, 45),
(19, 1, 60, 20, 80), (22, 1, 30, 10, 50), (25, 1, 40, 15, 60),


(2, 2, 50, 20, 70), (5, 2, 25, NULL, 45), (8, 2, 60, 20, 80),
(11, 2, 35, 10, 55), (14, 2, 45, 15, 65), (17, 2, 55, 25, 75),
(20, 2, 65, NULL, 85), (23, 2, 75, 30, 95), (26, 2, 85, 35, 105),


(3, 3, 95, 40, 115), (6, 3, 105, 45, 125), (9, 3, 115, NULL, 135),
(12, 3, 125, 50, 145), (15, 3, 135, 55, 155), (18, 3, 145, 60, 165),
(21, 3, 155, NULL, 175), (24, 3, 165, 65, 185);



INSERT INTO CLIENTE (ID_CLIENTE, ID_TIPODOCUMENTO_CLIENTE, ID_TIPOCLIENTE_CLIENTE, TELEFONO_CLIENTE, ID_SEDE_CLIENTE, EMAIL_CLIENTE, DIRECCION_CLIENTE, BARRIO_CLIENTE, CODIGOPOSTAL_CLIENTE, ESTADO_CLIENTE)
VALUES 
(1, 1, 1, '3101234567', 1, 'cliente1@example.com', 'Calle 123 #45-67', 'Centro', '110011', 'A'),
(2, 2, 1, '3207654321', 2, 'cliente2@example.com', 'Carrera 45 #10-20', 'Norte', '110022', 'A'),
(3, 3, 2, '3119988776', 3, 'empresa1@example.com', 'Avenida 68 #22-33', 'Sur', '110033', 'A');


INSERT INTO CLIENTENATURAL (ID_CLIENTE, NOMBRE_CLIENTE, APELLIDO_CLIENTE, FECHANACIMIENTO_CLIENTE, GENERO_CLIENTE, ESTADO_CLIENTE)
VALUES 
(1, 'Juan', 'Pérez', '1990-05-14', 'Masculino', 'A'),
(2, 'María', 'Gómez', '1985-10-20', 'Femenino', 'A');


INSERT INTO PROVEEDOR (ID_PROVEEDOR, NOMBRE_PROVEEDOR, ID_CIUDAD_PROVEEDOR, DIRECCION_PROVEEDOR, TELEFONO_PROVEEDOR, EMAIL_PROVEEDOR, ID_TIPOPROVEEDOR_PROVEEDOR, REPRESENTANTE_PROVEEDOR, 
    FECHAREGISTRO_PROVEEDOR, SALDO_PROVEEDOR, DIGITOVERIFICACION_PROVEEDOR, ESTADO_PROVEEDOR)
  VALUES
('123456789-5', 'CellTech Repuestos', '11.001', 'Calle 10 #15-30; Bogotá', '3001234567', 'ventas@celltech.com', 1, 'Marino Pérez', '2024-03-10', 500000, '5', 'A'),
('987654321-7', 'Accesorios Móvil Express', '25.214', 'Carrera 20 #45-10, Cota', '3012345678', 'contacto@movilexpress.com', 2, 'María Gómez', '2024-02-25', 750000, '7', 'A'),
('456789123-3', 'Repuestos y Más', '11.001', 'Avenida Central #101, Bogotá', '3023456789', 'info@repuestosymas.com', 2, 'Carlos Ramírez', '2024-01-15', 300000, '3', 'A'),
('789123456-9', 'Tecnocell Distribuciones', '11.001', 'Diagonal 50 #22-15, Bogotá', '3124567890', 'support@tecnocell.com', 1, 'Ana Torres', '2024-03-01', 600000, '9', 'A'),
('321654987-4', 'Mundo Celular Parts', '11.001', 'Transversal 5 #8-50, Bogotá', '3205678901', 'ventas@mundocelular.com', 1, 'Luis Martínez', '2024-03-15', 900000, '4', 'A');
