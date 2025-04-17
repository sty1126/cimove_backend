INSERT INTO CATEGORIA (DESCRIPCION_CATEGORIA) VALUES 
('Categoría Prueba A'),
('Categoría Prueba B'),
('Categoría Prueba C'),
('Categoría Prueba D');

INSERT INTO PRODUCTO (ID_PRODUCTO, ID_CATEGORIA_PRODUCTO, NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO, PRECIOVENTAACT_PRODUCTO, COSTOVENTA_PRODUCTO, MARGENUTILIDAD_PRODUCTO, VALORIVA_PRODUCTO) VALUES 
(1, 1, 'Producto Prueba A', 'Descripción del Producto Prueba A', 10000, 8000, 2000, 0.19),
(2, 1, 'Producto Prueba B', 'Descripción del Producto Prueba B', 11000, 8500, 2500, 0.19),
(3, 1, 'Producto Prueba C', 'Descripción del Producto Prueba C', 12000, 9000, 3000, 0.19),
(4, 1, 'Producto Prueba D', 'Descripción del Producto Prueba D', 13000, 9500, 3500, 0.19),
(5, 2, 'Producto Prueba E', 'Descripción del Producto Prueba E', 14000, 10000, 4000, 0.19),
(6, 2, 'Producto Prueba F', 'Descripción del Producto Prueba F', 15000, 10500, 4500, 0.19),
(7, 2, 'Producto Prueba G', 'Descripción del Producto Prueba G', 16000, 11000, 5000, 0.19),
(8, 2, 'Producto Prueba H', 'Descripción del Producto Prueba H', 17000, 11500, 5500, 0.19),
(9, 2, 'Producto Prueba I', 'Descripción del Producto Prueba I', 18000, 12000, 6000, 0.19),
(10, 3, 'Producto Prueba J', 'Descripción del Producto Prueba J', 19000, 12500, 6500, 0.19),
(11, 3, 'Producto Prueba K', 'Descripción del Producto Prueba K', 20000, 13000, 7000, 0.19),
(12, 3, 'Producto Prueba L', 'Descripción del Producto Prueba L', 21000, 13500, 7500, 0.19),
(13, 3, 'Producto Prueba M', 'Descripción del Producto Prueba M', 22000, 14000, 8000, 0.19),
(14, 3, 'Producto Prueba N', 'Descripción del Producto Prueba N', 23000, 14500, 8500, 0.19),
(15, 4, 'Producto Prueba O', 'Descripción del Producto Prueba O', 24000, 15000, 9000, 0.19),
(16, 4, 'Producto Prueba P', 'Descripción del Producto Prueba P', 25000, 15500, 9500, 0.19),
(17, 4, 'Producto Prueba Q', 'Descripción del Producto Prueba Q', 26000, 16000, 10000, 0.19),
(18, 4, 'Producto Prueba R', 'Descripción del Producto Prueba R', 27000, 16500, 10500, 0.19),
(19, 4, 'Producto Prueba S', 'Descripción del Producto Prueba S', 28000, 17000, 11000, 0.19),
(20, 4, 'Producto Prueba T', 'Descripción del Producto Prueba T', 29000, 17500, 11500, 0.19),
(21, 4, 'Producto Prueba U', 'Descripción del Producto Prueba U', 30000, 18000, 12000, 0.19),
(22, 4, 'Producto Prueba V', 'Descripción del Producto Prueba V', 31000, 18500, 12500, 0.19),
(23, 4, 'Producto Prueba W', 'Descripción del Producto Prueba W', 32000, 19000, 13000, 0.19),
(24, 4, 'Producto Prueba X', 'Descripción del Producto Prueba X', 33000, 19500, 13500, 0.19),
(25, 4, 'Producto Prueba Y', 'Descripción del Producto Prueba Y', 34000, 20000, 14000, 0.19),
(26, 4, 'Producto Prueba Z', 'Descripción del Producto Prueba Z', 35000, 20500, 14500, 0.19);

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

INSERT INTO CLIENTEJURIDICO (ID_CLIENTE, RAZONSOCIAL_CLIENTE, NOMBRECOMERCIAL_CLIENTE, REPRESENTANTE_CLIENTE, DIGITOVERIFICACION_CLIENTE, ESTADO_CLIENTE) 
VALUES 
(3, 'Empresa de Pruebas S.A.', 'Empresas Pruebas', 'Carlos Ramírez', 7, 'A');


INSERT INTO PROVEEDOR (ID_PROVEEDOR, NOMBRE_PROVEEDOR, ID_CIUDAD_PROVEEDOR, DIRECCION_PROVEEDOR, TELEFONO_PROVEEDOR, EMAIL_PROVEEDOR, ID_TIPOPROVEEDOR_PROVEEDOR, REPRESENTANTE_PROVEEDOR, 
    FECHAREGISTRO_PROVEEDOR, SALDO_PROVEEDOR, DIGITOVERIFICACION_PROVEEDOR, ESTADO_PROVEEDOR)
  VALUES
('123456789-5', 'CellTech Repuestos', '11.001', 'Calle 10 #15-30; Bogotá', '3001234567', 'ventas@celltech.com', 1, 'Marino Pérez', '2024-03-10', 500000, '5', 'A'),
('987654321-7', 'Accesorios Móvil Express', '25.214', 'Carrera 20 #45-10, Cota', '3012345678', 'contacto@movilexpress.com', 2, 'María Gómez', '2024-02-25', 750000, '7', 'A'),
('456789123-3', 'Repuestos y Más', '11.001', 'Avenida Central #101, Bogotá', '3023456789', 'info@repuestosymas.com', 2, 'Carlos Ramírez', '2024-01-15', 300000, '3', 'A'),
('789123456-9', 'Tecnocell Distribuciones', '11.001', 'Diagonal 50 #22-15, Bogotá', '3124567890', 'support@tecnocell.com', 1, 'Ana Torres', '2024-03-01', 600000, '9', 'A'),
('321654987-4', 'Mundo Celular Parts', '11.001', 'Transversal 5 #8-50, Bogotá', '3205678901', 'ventas@mundocelular.com', 1, 'Luis Martínez', '2024-03-15', 900000, '4', 'A');


INSERT INTO ORDENCOMPRA (ID_PROVEEDOR_ORDENCOMPRA, FECHA_ORDENCOMPRA, TOTAL_ORDENCOMPRA) VALUES
('123456789-5', '2024-03-12', 250000),
('987654321-7', '2024-02-28', 320000),
('456789123-3', '2024-01-20', 150000),
('789123456-9', '2024-03-05', 275000),
('321654987-4', '2024-03-18', 400000);


INSERT INTO FACTURAPROVEEDOR (ID_ORDENCOMPRA_FACTURAPROVEEDOR, FECHA_FACTURAPROVEEDOR, MONTO_FACTURAPROVEEDOR) VALUES
(1, '2024-03-13', 250000),
(2, '2024-02-29', 320000),
(3, '2024-01-21', 150000),
(4, '2024-03-06', 275000),
(5, '2024-03-19', 400000);


INSERT INTO DETALLEORDENCOMPRA (
    ID_ORDENCOMPRA_DETALLEORDENCOMPRA, 
    ID_PRODUCTO_DETALLEORDENCOMPRA, CANTIDAD_DETALLEORDENCOMPRA, 
    PRECIOUNITARIO_DETALLEORDENCOMPRA, SUBTOTAL_DETALLEORDENCOMPRA
) VALUES
(1, 1, 5, 50000, 250000),
(2, 1, 4, 80000, 320000),
(3, 2, 10, 15000, 150000),
(4, 3, 11, 25000, 275000),
(5, 2, 8, 50000, 400000);


INSERT INTO ABONOFACTURA (
    ID_FACTURAPROVEEDOR_ABONOFACTURA, 
    FECHA_ABONOFACTURA, MONTO_ABONOFACTURA
) VALUES
(1, '2024-03-20', 150000),
(2, '2024-03-01', 320000),
(3, '2024-01-25', 75000),
(4, '2024-03-10', 275000),
(5, '2024-03-25', 200000);

INSERT INTO PROVEEDORPRODUCTO (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
SELECT '123456789-5', id_producto, 'A'
FROM producto
WHERE NOT EXISTS (
  SELECT 1
  FROM proveedorproducto pp
  WHERE pp.id_producto_proveedorproducto = producto.id_producto
  AND pp.id_proveedor_proveedorproducto = '123456789-5'
);

INSERT INTO PROVEEDORPRODUCTO (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
SELECT '987654321-7', id_producto, 'A'
FROM producto
WHERE id_producto % 2 = 0;

INSERT INTO empleado (
  id_empleado, id_sede_empleado, id_tipodocumento_empleado,
  nombre_empleado, telefono_usuario, cargo_empleado,
  email_empleado, estado_empleado
)
VALUES 
  (1, 1, 1, 'María Rodríguez', '3001234567', 'Gerente', 'maria@empresa.com', 'A'),
  (2, 2, 1, 'Carlos Gómez', '3109876543', 'Vendedor', 'carlos@empresa.com', 'A'),
  (3, 1, 1, 'Lucía Pérez', '3011122334', 'Asistente', 'lucia@empresa.com', 'A');

INSERT INTO USUARIO (
  ID_EMPLEADO_USUARIO,
  CONTRASENA_USUARIO,
  EMAIL_USUARIO,
  TELEFONO_USUARIO,
  ID_TIPOUSUARIO_USUARIO,
  ESTADO_USUARIO
)
VALUES
  (1, 'admin123', 'maria.perez@kpershop.com', '3100000001', 1, 'A'), -- María, Admin
  (2, 'ventas123', 'carlos.garcia@kpershop.com', '3100000002', 2, 'A'), -- Carlos, Vendedor
  (3, 'asist123', 'lucia.moreno@kpershop.com', '3100000003', 2, 'A'); -- Lucía, Vendedora

