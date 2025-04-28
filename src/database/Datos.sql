

INSERT INTO PAIS (ID_PAIS, NOMBRE_PAIS, ESTADO_PAIS) VALUES ('COL', 'Colombia', 'A');


INSERT INTO DEPARTAMENTO (ID_DPTO, NOMBRE_DPTO, ID_PAIS_DPTO) VALUES ('25', 'Cundinamarca', 'COL');
INSERT INTO DEPARTAMENTO (ID_DPTO, NOMBRE_DPTO, ID_PAIS_DPTO) VALUES ('11', 'Bogotá D.C.', 'COL');


INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('11.001', 'Bogotá', '11');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.126', 'Cajicá', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.214', 'Cota', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.286', 'Funza', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.377', 'La Calera', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.43', 'Madrid', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.473', 'Mosquera', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.754', 'Soacha', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.785', 'Tabio', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.799', 'Tenjo', '25');
INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ID_DPTO_CIUDAD) VALUES ('25.899', 'Zipaquirá', '25');


INSERT INTO TIPOMOV (NOM_TIPOMOV) VALUES 
('Entrada por Ajuste'),
('Salida por Ajuste'),
('Ventas Crédito'),
('Ventas Contado'),
('Cambio de sede'),
('Ingreso por Garantía'),
('Salida por Garantía'),
('Ingreso por Reparación'),
('Salida por Reparación');


INSERT INTO TIPODOCUMENTO (DESCRIPCION_TIPODOCUMENTO, ESTADO_TIPODOCUMENTO)
VALUES 
('Cédula de Ciudadanía', 'A'),
('Tarjeta de Identidad', 'A'),
('Cédula de Extranjería', 'A'),
('Pasaporte', 'A'),
('NIT', 'A');


INSERT INTO TIPOCLIENTE (DESCRIPCION_TIPOCLIENTE, ESTADO_TIPOCLIENTE)
VALUES 
('Persona Natural', 'A'),
('Persona Jurídica', 'A');


INSERT INTO TIPOPROVEEDOR (NOMBRE_TIPOPROVEEDOR, ESTADO_TIPOPROVEEDOR)
VALUES 
('Proveedor de Mercancía', 'A'),
('Proveedor de Servicios Técnicos', 'A');

INSERT INTO tipousuario (descripcion_tipousuario, estado_tipousuario)
VALUES 
  ('Administrador', 'A'),
  ('Vendedor', 'A');

INSERT INTO PROVEEDOR (
    id_proveedor, nombre_proveedor, id_ciudad_proveedor, direccion_proveedor, 
    telefono_proveedor, email_proveedor, id_tipoproveedor_proveedor, representante_proveedor, 
    fecharegistro_proveedor, saldo_proveedor, digitoverificacion_proveedor
) 
VALUES (
    'PROV_TEMP_123', 
    'Proveedor Temporal', 
    '11.001',  
    'Dirección temporal', 
    '123456789', 
    'temporal@proveedor.com', 
    2,  
    'Representante Temporal', 
    CURRENT_DATE, 
    0, 
    '0'  
) 
RETURNING id_proveedor;
