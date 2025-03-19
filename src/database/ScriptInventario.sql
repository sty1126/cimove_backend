CREATE DATABASE CIMOVE;
\c CIMOVE;

CREATE TABLE CATEGORIA (
    ID_CATEGORIA SERIAL PRIMARY KEY,
    DESCRIPCION_CATEGORIA VARCHAR(255) NOT NULL,
    ESTADO_CATEGORIA CHAR(1) NOT NULL DEFAULT 'A'
);

CREATE TABLE PRODUCTO (
    ID_PRODUCTO SERIAL PRIMARY KEY,
    ID_CATEGORIA_PRODUCTO INT NOT NULL,
    NOMBRE_PRODUCTO VARCHAR(255) NOT NULL,
    DESCRIPCION_PRODUCTO VARCHAR(500),
    PRECIOVENTAACT_PRODUCTO INT NOT NULL,
    PRECIOVENTAANT_PRODUCTO INT,
    COSTOVENTA_PRODUCTO INT NOT NULL,
    MARGENUTILIDAD_PRODUCTO INT,
    VALORIVA_PRODUCTO DOUBLE PRECISION,
    ESTADO_PRODUCTO CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_PRODUCTO_CATEGORIA FOREIGN KEY (ID_CATEGORIA_PRODUCTO) REFERENCES CATEGORIA(ID_CATEGORIA)
);

CREATE TABLE INVENTARIO (
    ID_INVENTARIO SERIAL PRIMARY KEY,
    ID_PRODUCTO_INVENTARIO INT NOT NULL,
    EXISTENCIA_INVENTARIO INT NOT NULL,
    ESTADO_INVENTARIO CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_INVENTARIO_PRODUCTO FOREIGN KEY (ID_PRODUCTO_INVENTARIO) REFERENCES PRODUCTO(ID_PRODUCTO)
);

CREATE TABLE PAIS (
    ID_PAIS VARCHAR(10) PRIMARY KEY,
    NOMBRE_PAIS VARCHAR(255) NOT NULL,
    ESTADO_PAIS CHAR(1) NOT NULL DEFAULT 'A'
);

CREATE TABLE DEPARTAMENTO (
    ID_DPTO VARCHAR(10) PRIMARY KEY,
    NOMBRE_DPTO VARCHAR(255) NOT NULL,
    ID_PAIS_DPTO VARCHAR(10) NOT NULL,
    ESTADO_DPTO CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_DEPARTAMENTO_PAIS FOREIGN KEY (ID_PAIS_DPTO) REFERENCES PAIS(ID_PAIS)
);

CREATE TABLE CIUDAD (
    ID_CIUDAD VARCHAR(10) PRIMARY KEY,
    NOMBRE_CIUDAD VARCHAR(255) NOT NULL,
    ID_DPTO_CIUDAD VARCHAR(10) NOT NULL,
    ESTADO_CIUDAD CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_CIUDAD_DEPARTAMENTO FOREIGN KEY (ID_DPTO_CIUDAD) REFERENCES DEPARTAMENTO(ID_DPTO)
);

CREATE TABLE SEDE (
    ID_SEDE SERIAL PRIMARY KEY,
    NOMBRE_SEDE VARCHAR(255) NOT NULL,
    ID_CIUDAD_SEDE VARCHAR(10) NOT NULL,
    DIRECCION_SEDE VARCHAR(255) NOT NULL,
    NUMEROEMPLEADOS_SEDE INT NOT NULL,
    TELEFONO_SEDE VARCHAR(20),
    ESTADO_SEDE CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_SEDE_CIUDAD FOREIGN KEY (ID_CIUDAD_SEDE) REFERENCES CIUDAD(ID_CIUDAD)
);

CREATE TABLE INVENTARIOLOCAL (
    ID_INVENTARIOLOCAL SERIAL PRIMARY KEY,
    ID_PRODUCTO_INVENTARIOLOCAL INT NOT NULL,
    ID_SEDE_INVENTARIOLOCAL INT NOT NULL,
    EXISTENCIA_INVENTARIOLOCAL INT NOT NULL,
    STOCKMINIMO_INVENTARIOLOCAL INT,
    STOCKMAXIMO_INVENTARIOLOCAL INT NOT NULL,
    ESTADO_INVENTARIOLOCAL CHAR(1) NOT NULL DEFAULT 'A',
    CONSTRAINT FK_INVENTARIOLOCAL_PRODUCTO FOREIGN KEY (ID_PRODUCTO_INVENTARIOLOCAL) REFERENCES PRODUCTO(ID_PRODUCTO),
    CONSTRAINT FK_INVENTARIOLOCAL_SEDE FOREIGN KEY (ID_SEDE_INVENTARIOLOCAL) REFERENCES SEDE(ID_SEDE)
);

CREATE TABLE TIPODOCUMENTO (
    ID_TIPODOCUMENTO INT PRIMARY KEY,
    DESCRIPCION_TIPODOCUMENTO VARCHAR(255) NOT NULL,
    ESTADO_TIPODOCUMENTO CHAR(1) DEFAULT 'A' NOT NULL
);

CREATE TABLE TIPOCLIENTE (
    ID_TIPOCLIENTE INT PRIMARY KEY,
    DESCRIPCION_TIPOCLIENTE VARCHAR(255) NOT NULL,
    ESTADO_TIPOCLIENTE CHAR(1) DEFAULT 'A' NOT NULL
);

CREATE TABLE CLIENTE (
    ID_CLIENTE INT PRIMARY KEY,
    ID_TIPODOCUMENTO_CLIENTE INT NOT NULL,
    ID_TIPOCLIENTE_CLIENTE INT NOT NULL,
    TELEFONO_CLIENTE VARCHAR(20) NOT NULL,
    ID_SEDE_CLIENTE INT NOT NULL,
    EMAIL_CLIENTE VARCHAR(255),
    DIRECCION_CLIENTE VARCHAR(255),
    BARRIO_CLIENTE VARCHAR(255),
    CODIGOPOSTAL_CLIENTE VARCHAR(20),
    ESTADO_CLIENTE CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_TIPODOCUMENTO_CLIENTE) REFERENCES TIPODOCUMENTO(ID_TIPODOCUMENTO),
    FOREIGN KEY (ID_TIPOCLIENTE_CLIENTE) REFERENCES TIPOCLIENTE(ID_TIPOCLIENTE)
);

CREATE TABLE CLIENTENATURAL (
    ID_CLIENTE INT PRIMARY KEY,
    NOMBRE_CLIENTE VARCHAR(255) NOT NULL,
    APELLIDO_CLIENTE VARCHAR(255) NOT NULL,
    FECHANACIMIENTO_CLIENTE DATE NOT NULL,
    GENERO_CLIENTE VARCHAR(50),
    ESTADO_CLIENTE CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTE(ID_CLIENTE)
);

CREATE TABLE CLIENTEJURIDICO (
    ID_CLIENTE INT PRIMARY KEY,
    RAZONSOCIAL_CLIENTE VARCHAR(255) NOT NULL,
    NOMBRECOMERCIAL_CLIENTE VARCHAR(255),
    REPRESENTANTE_CLIENTE VARCHAR(255),
    DIGITOVERIFICACION_CLIENTE INT,
    ESTADO_CLIENTE CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_CLIENTE) REFERENCES CLIENTE(ID_CLIENTE)
);

CREATE TABLE TIPOPROVEEDOR (
    ID_TIPOPROVEEDOR INT PRIMARY KEY,
    NOMBRE_TIPOPROVEEDOR VARCHAR(255) NOT NULL,
    ESTADO_TIPOPROVEEDOR CHAR(1) DEFAULT 'A' NOT NULL
);

CREATE TABLE PROVEEDOR (
    ID_PROVEEDOR INT PRIMARY KEY,
    NOMBRE_PROVEEDOR VARCHAR(255) NOT NULL,
    ID_CIUDAD_PROVEEDOR INT NOT NULL,
    DIRECCION_PROVEEDOR VARCHAR(255),
    TELEFONO_PROVEEDOR VARCHAR(20) NOT NULL,
    EMAIL_PROVEEDOR VARCHAR(255),
    ID_TIPOPROVEEDOR_PROVEEDOR INT NOT NULL,
    REPRESENTANTE_PROVEEDOR VARCHAR(255),
    FECHAREGISTRO_PROVEEDOR DATE NOT NULL,
    SALDO_PROVEEDOR INT DEFAULT 0,
    ESTADO_PROVEEDOR CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_TIPOPROVEEDOR_PROVEEDOR) REFERENCES TIPOPROVEEDOR(ID_TIPOPROVEEDOR)
);

CREATE TABLE SERVICIOTECNICO (
    ID_SERVICIOTECNICO INT PRIMARY KEY,
    ID_SEDE_SERVICIOTECNICO INT NOT NULL,
    ID_PROVEEDOR_SERVICIOTECNICO INT NOT NULL,
    ID_CLIENTE_SERVICIOTECNICO INT NOT NULL,
    ID_FACTURA_SERVICIOTECNICO INT NOT NULL,
    NOMBRE_SERVICIOTECNICO VARCHAR(255) NOT NULL,
    DESCRIPCION_SERVICIOTECNICO VARCHAR(500),
    FECHA_SERVICIOTECNICO DATE NOT NULL,
    COSTO_SERVICIOTECNICO INT NOT NULL,
    ESTADO_SERVICIOTECNICO CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_PROVEEDOR_SERVICIOTECNICO) REFERENCES PROVEEDOR(ID_PROVEEDOR),
    FOREIGN KEY (ID_CLIENTE_SERVICIOTECNICO) REFERENCES CLIENTE(ID_CLIENTE)
);

CREATE TABLE PROVEEDORPRODUCTO (
    ID_PROVEEDORPRODUCTO INT PRIMARY KEY,
    ID_PROVEEDOR_PROVEEDORPRODUCTO INT NOT NULL,
    ID_PRODUCTO_PROVEEDORPRODUCTO INT NOT NULL,
    ESTADO_PROVEEDORPRODUCTO CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_PROVEEDOR_PROVEEDORPRODUCTO) REFERENCES PROVEEDOR(ID_PROVEEDOR)
);

CREATE TABLE ORDENCOMPRA (
    ID_ORDENCOMPRA INT PRIMARY KEY,
    ID_PROVEEDOR_ORDENCOMPRA INT NOT NULL,
    FECHA_ORDENCOMPRA DATE NOT NULL,
    TOTAL_ORDENCOMPRA INT NOT NULL,
    ESTADO_FACTURAPROVEEDOR CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_PROVEEDOR_ORDENCOMPRA) REFERENCES PROVEEDOR(ID_PROVEEDOR)
);

CREATE TABLE FACTURAPROVEEDOR (
    ID_FACTURAPROVEEDOR INT PRIMARY KEY,
    ID_ORDENCOMPRA_FACTURAPROVEEDOR INT NOT NULL,
    FECHA_FACTURAPROVEEDOR DATE NOT NULL,
    MONTO_FACTURAPROVEEDOR INT NOT NULL,
    ESTADO_FACTURAPROVEEDOR CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_ORDENCOMPRA_FACTURAPROVEEDOR) REFERENCES ORDENCOMPRA(ID_ORDENCOMPRA)
);

CREATE TABLE DETALLEORDENCOMPRA (
    ID_DETALLEORDENCOMPRA INT PRIMARY KEY,
    ID_ORDENCOMPRA_DETALLEORDENCOMPRA INT NOT NULL,
    ID_PRODUCTO_DETALLEORDENCOMPRA INT NOT NULL,
    CANTIDAD_DETALLEORDENCOMPRA INT NOT NULL,
    PRECIOUNITARIO_DETALLEORDENCOMPRA INT NOT NULL,
    SUBTOTAL_DETALLEORDENCOMPRA INT NOT NULL,
    ESTADO_DETALLEORDENCOMPRA CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_ORDENCOMPRA_DETALLEORDENCOMPRA) REFERENCES ORDENCOMPRA(ID_ORDENCOMPRA)
);

CREATE TABLE ABONOFACTURA (
    ID_ABONOFACTURA INT PRIMARY KEY,
    ID_FACTURAPROVEEDOR_ABONOFACTURA INT NOT NULL,
    FECHA_ABONOFACTURA DATE NOT NULL,
    MONTO_ABONOFACTURA INT NOT NULL,
    ESTADO_ABONOFACTURA CHAR(1) DEFAULT 'A' NOT NULL,
    FOREIGN KEY (ID_FACTURAPROVEEDOR_ABONOFACTURA) REFERENCES FACTURAPROVEEDOR(ID_FACTURAPROVEEDOR)
);

CREATE TABLE TIPOMOV (
    ID_TIPOMOV SERIAL PRIMARY KEY,
    NOM_TIPOMOV VARCHAR(50),
    ESTADO_TIPOMOV VARCHAR(20) NOT NULL DEFAULT 'A'
);

CREATE TABLE MOVPRODUCTO (
    ID_MOVIMIENTO SERIAL PRIMARY KEY,
    ID_TIPOMOV_MOVIMIENTO INT NOT NULL,
    ID_PRODUCTO_MOVIMIENTO INT NOT NULL,
    CANTIDAD_MOVIMIENTO INT NOT NULL,
    FECHA_MOVIMIENTO DATE DEFAULT CURRENT_DATE,
    ESTADO_MOVIMIENTO VARCHAR(20),

    -- Para cambios de sede
    ID_SEDE_MOVIMIENTO INT NOT NULL,
    ID_SEDEDESTINO_MOVIMIENTO INT,

    -- Para clientes en ventas/créditos/garantías
    ID_CLIENTE_MOVIMIENTO INT,

    -- Para reparaciones
    ID_PROVEEDOR_MOVIMIENTO INT,

    CONSTRAINT fk_tipomov_producto FOREIGN KEY (ID_TIPOMOV_MOVIMIENTO) REFERENCES TIPOMOV (ID_TIPOMOV),
    CONSTRAINT fk_producto_movimiento FOREIGN KEY (ID_PRODUCTO_MOVIMIENTO) REFERENCES PRODUCTO (ID_PRODUCTO),
    CONSTRAINT fk_sede_origen FOREIGN KEY (ID_SEDE_MOVIMIENTO) REFERENCES SEDE (ID_SEDE),
    CONSTRAINT fk_sede_destino FOREIGN KEY (ID_SEDEDESTINO_MOVIMIENTO) REFERENCES SEDE (ID_SEDE),
    CONSTRAINT fk_cliente_mov FOREIGN KEY (ID_CLIENTE_MOVIMIENTO) REFERENCES CLIENTE (ID_CLIENTE),
    CONSTRAINT fk_proveedor_mov FOREIGN KEY (ID_PROVEEDOR_MOVIMIENTO) REFERENCES PROVEEDOR (ID_PROVEEDOR)
);


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


CREATE OR REPLACE FUNCTION actualizar_precio_anterior()
RETURNS TRIGGER AS $$
BEGIN
  -- Solo actualizar si el precio de venta actual cambia
  IF OLD.precioventaact_producto <> NEW.precioventaact_producto THEN
    NEW.precioventaant_producto = OLD.precioventaact_producto;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trigger_actualizar_precio_anterior
BEFORE UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION actualizar_precio_anterior();


CREATE OR REPLACE FUNCTION actualizar_margen_utilidad()
RETURNS TRIGGER AS $$
BEGIN
  NEW.margenutilidad_producto := NEW.precioventaact_producto - NEW.costoventa_producto;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;


CREATE TRIGGER trg_actualizar_margen
BEFORE INSERT OR UPDATE ON producto
FOR EACH ROW
EXECUTE FUNCTION actualizar_margen_utilidad();


INSERT INTO TIPOMOV (ID_TIPOMOV, NOM_TIPOMOV) VALUES 
(1, 'Entrada por Ajuste'),
(2, 'Salida por Ajuste'),
(3, 'Ventas Crédito'),
(4, 'Ventas Contado'),
(5, 'Cambio de sede'),
(6, 'Ingreso por Garantía'),
(7, 'Salida por Garantía'),
(8, 'Ingreso por Reparación'),
(9, 'Salida por Reparación');


INSERT INTO TIPODOCUMENTO (ID_TIPODOCUMENTO, DESCRIPCION_TIPODOCUMENTO, ESTADO_TIPODOCUMENTO)
VALUES 
(1, 'Cédula de Ciudadanía', 'A'),
(2, 'Tarjeta de Identidad', 'A'),
(3, 'Cédula de Extranjería', 'A'),
(4, 'Pasaporte', 'A');