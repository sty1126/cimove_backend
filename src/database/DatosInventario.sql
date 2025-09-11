INSERT INTO CATEGORIA (DESCRIPCION_CATEGORIA) VALUES 
('Papelería'),
('Cables y Adaptadores'),
('Tarjetas SIM'),
('Memorias y Almacenamiento');

INSERT INTO PRODUCTO (
  ID_PRODUCTO, ID_CATEGORIA_PRODUCTO, NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO,
  PRECIOVENTAACT_PRODUCTO, COSTOVENTA_PRODUCTO, VALORIVA_PRODUCTO
) VALUES
-- Categoría 'Papelería'
(9001, 9, 'Bolsas regalo', 'Bolsas de papel para obsequios', 1500, 700, 0.19),
(9002, 9, 'Calculadora científica', 'Calculadora programable para estudios', 45000, 20000, 0.19),
(9003, 9, 'Sombrillas', 'Sombrillas plegables de diversos colores', 25000, 12000, 0.19),
(9004, 9, 'Papel Regalo', 'Rollo de papel de regalo con varios diseños', 5000, 2500, 0.19),
(9005, 9, 'Cinta de enmascarar', 'Cinta adhesiva para manualidades y pintura', 3000, 1500, 0.19),
(9006, 9, 'Lluvia de sobres', 'Sobres pequeños para obsequios de dinero', 2000, 1000, 0.19),
(9007, 9, 'Marcadores Pelikan rojo', 'Marcador de tinta permanente color rojo', 2500, 1200, 0.19),
(9008, 9, 'Marcadores Pelikan de colores', 'Set de marcadores permanentes de varios colores', 15000, 7500, 0.19),
(9009, 9, 'Caja clip Jumbo', 'Caja de 50 clips de tamaño jumbo', 8000, 4000, 0.19),
(9010, 9, 'Colbon pequeño sipega', 'Pegamento líquido de uso escolar', 3500, 1700, 0.19),
(9011, 9, 'Bolígrafo color negro offi esco', 'Bolígrafo de tinta negra', 1000, 500, 0.19),
(9012, 9, 'Esferos Bic', 'Esferos de tinta líquida', 1200, 600, 0.19),
(9013, 9, 'Caja lápices Faber Castell', 'Caja de 12 lápices de grafito', 20000, 10000, 0.19),
(9014, 9, 'Tapabocas', 'Paquete de tapabocas desechables', 1000, 500, 0.19),
(9015, 9, 'Cartucheras', 'Estuches para guardar útiles escolares', 15000, 7500, 0.19),
(9016, 9, 'Carpetas', 'Carpetas de cartón de colores variados', 2000, 1000, 0.19),
(9017, 9, 'Cuadernos 100 hojas Scribe', 'Cuadernos de 100 hojas', 10000, 5000, 0.19),
(9018, 9, 'Marcadores Sharpie', 'Set de marcadores permanentes Sharpie', 25000, 12500, 0.19),
-- Categoría 'Cables y Adaptadores'
(10001, 10, 'Cable audio', 'Cable auxiliar para dispositivos de audio', 15000, 7500, 0.19),
(10002, 10, 'Cable Magnético', 'Cable de carga con conector magnético', 25000, 12500, 0.19),
(10003, 10, 'Cable tipo C', 'Cable de carga y datos para dispositivos Tipo C', 18000, 9000, 0.19),
(10004, 10, 'Cable iPhone', 'Cable de carga y datos para dispositivos iPhone', 20000, 10000, 0.19),
(10005, 10, 'Cable iPhone metálico', 'Cable de carga y datos para iPhone con cubierta metálica', 22000, 11000, 0.19),
(10006, 10, 'Cable 2m tipo c', 'Cable de carga y datos de 2 metros con conector Tipo C', 25000, 12500, 0.19),
(10007, 10, 'Cable 2x1', 'Cable de carga con dos conectores', 20000, 10000, 0.19),
(10008, 10, 'Cable 1 a 3', 'Cable con tres conectores de carga diferentes', 25000, 12500, 0.19),
(10009, 10, 'Cable VGA', 'Cable de video VGA para monitores y proyectores', 30000, 15000, 0.19),
(10010, 10, 'Cable Power infinito', 'Cable de poder para computadoras', 18000, 9000, 0.19),
(10011, 10, 'Poder trebol', 'Cable de poder con conector tipo trébol', 19000, 9500, 0.19),
(10012, 10, 'Multipuerto USB', 'Adaptador con varios puertos USB', 40000, 20000, 0.19),
(10013, 10, 'HDMI', 'Cable de alta definición HDMI', 35000, 17500, 0.19),
(10014, 10, 'Red 3M', 'Cable de red ethernet de 3 metros', 20000, 10000, 0.19),
(10015, 10, 'USB 3-1 C', 'Adaptador USB 3.1 a conector Tipo C', 25000, 12500, 0.19),
-- Categoría 'Cargadores y Fuentes'
(3001, 3, 'Cargador iPhone', 'Cargador de pared para dispositivos iPhone', 30000, 15000, 0.19),
(3002, 3, 'Cargador portable Vigour', 'Batería externa portátil marca Vigour', 50000, 25000, 0.19),
(3003, 3, 'Data Cable set', 'Set de cables de datos para varios dispositivos', 20000, 10000, 0.19),
(3004, 3, 'Cargador genérico V8', 'Cargador de pared genérico para dispositivos V8', 15000, 7500, 0.19),
(3005, 3, 'Cargador 2A T.C', 'Cargador de 2 amperios con conector Tipo C', 18000, 9000, 0.19),
(3006, 3, 'Cargador Motorola+', 'Cargador de pared para teléfonos Motorola', 25000, 12500, 0.19),
(3007, 3, 'Cargador SAmsung v8', 'Cargador de pared para dispositivos Samsung V8', 20000, 10000, 0.19),
-- Categoría 'Tarjetas SIM'
(11001, 11, 'Claro 4G', 'Tarjeta SIM prepago Claro 4G', 5000, 2500, 0.19),
(11002, 11, 'Tigo 5GB', 'Tarjeta SIM prepago Tigo con 5GB de datos', 6000, 3000, 0.19),
-- Categoría 'Audífonos y Manos Libres'
(5001, 5, 'Audifonos acable Batri', 'Audífonos con cable marca Batri', 15000, 7500, 0.19),
(5002, 5, 'Audífonos inalámbricos', 'Audífonos con conectividad Bluetooth', 40000, 20000, 0.19),
-- Categoría 'Memorias y Almacenamiento'
(12001, 12, 'USB Lightning iPhone', 'Memoria USB con conector Lightning para iPhone', 25000, 12500, 0.19),
(12002, 12, 'USB 4GB', 'Memoria USB de 4GB', 10000, 5000, 0.19),
(12003, 12, 'USB 8GB', 'Memoria USB de 8GB', 15000, 7500, 0.19),
(12004, 12, 'USB 16GB', 'Memoria USB de 16GB', 20000, 10000, 0.19),
(12005, 12, 'USB 32GB', 'Memoria USB de 32GB', 25000, 12500, 0.19),
(12006, 12, 'USB 64GB', 'Memoria USB de 64GB', 40000, 20000, 0.19),
(12007, 12, 'USB 128GB', 'Memoria USB de 128GB', 60000, 30000, 0.19),
(12008, 12, 'Micro SD 4GB', 'Tarjeta Micro SD de 4GB', 8000, 4000, 0.19),
(12009, 12, 'Micro SD 8GB', 'Tarjeta Micro SD de 8GB', 12000, 6000, 0.19),
(12010, 12, 'Micro SD 12GB', 'Tarjeta Micro SD de 12GB', 15000, 7500, 0.19),
(12011, 12, 'Micro SD 16GB', 'Tarjeta Micro SD de 16GB', 18000, 9000, 0.19),
(12012, 12, 'Micro SD 32GB', 'Tarjeta Micro SD de 32GB', 22000, 11000, 0.19),
(12013, 12, 'Micro SD 64GB', 'Tarjeta Micro SD de 64GB', 35000, 17500, 0.19),
(12014, 12, 'Micro SD 128GB', 'Tarjeta Micro SD de 128GB', 55000, 27500, 0.19),
(12015, 12, 'Micro SD 256GB', 'Tarjeta Micro SD de 256GB', 0, 0, 0.19);


--Para las fundas del celular 
INSERT INTO PRODUCTO (
  ID_PRODUCTO, ID_CATEGORIA_PRODUCTO, NOMBRE_PRODUCTO, DESCRIPCION_PRODUCTO,
  PRECIOVENTAACT_PRODUCTO, COSTOVENTA_PRODUCTO, VALORIVA_PRODUCTO
) VALUES
-- Vidrios Templados (Categoría 1: Accesorios para Celulares)
(88000001, 1, 'Vidrio templado iPhone 6/7/8', 'Vidrio templado para modelos de iPhone 6, 7 y 8', 10000, 5000, 0.19),
(88000002, 1, 'Vidrio templado iPhone X/11', 'Vidrio templado para modelos de iPhone X y 11', 12000, 6000, 0.19),
(88000003, 1, 'Vidrio templado iPhone 11 Pro', 'Vidrio templado para iPhone 11 Pro', 14000, 7000, 0.19),
(88000004, 1, 'Vidrio templado iPhone 12 mini', 'Vidrio templado para iPhone 12 mini', 15000, 7500, 0.19),
(88000005, 1, 'Vidrio templado iPhone 12 pro max', 'Vidrio templado para iPhone 12 Pro Max', 16000, 8000, 0.19),
(88000006, 1, 'Vidrio templado iPhone 14 pro max', 'Vidrio templado para iPhone 14 Pro Max', 18000, 9000, 0.19),
(88000007, 1, 'Vidrio templado iPhone 15/15 pro', 'Vidrio templado para modelos de iPhone 15 y 15 Pro', 20000, 10000, 0.19),
(88000008, 1, 'Vidrio templado Samsung S8/S9', 'Vidrio templado para modelos de Samsung S8 y S9', 10000, 5000, 0.19),
(88000009, 1, 'Vidrio templado Samsung A36/A52/S10/S21 FE', 'Vidrio templado para varios modelos de Samsung A y S', 13000, 6500, 0.19),
(88000010, 1, 'Vidrio templado Samsung J7/J5 prime', 'Vidrio templado para modelos de Samsung J7 y J5 Prime', 11000, 5500, 0.19),
(88000011, 1, 'Vidrio templado Huawei Y6/Y5 2019', 'Vidrio templado para modelos de Huawei Y6 y Y5 (2019)', 10000, 5000, 0.19),
(88000012, 1, 'Vidrio templado Huawei Y7/Y6 II/Y6 2018', 'Vidrio templado para varios modelos de Huawei Y', 10000, 5000, 0.19),
(88000013, 1, 'Vidrio templado Motorola G5/G6/G5s/G6', 'Vidrio templado para varios modelos de Motorola G', 11000, 5500, 0.19),
(88000014, 1, 'Vidrio templado Motorola G7+/G8 plus/E6/E6 play', 'Vidrio templado para varios modelos de Motorola', 13000, 6500, 0.19),
(88000015, 1, 'Vidrio templado Motorola E32/E40/One Fusion', 'Vidrio templado para varios modelos de Motorola', 14000, 7000, 0.19),
(88000016, 1, 'Vidrio templado Motorola G10/G60/G23/G50', 'Vidrio templado para varios modelos de Motorola G', 15000, 7500, 0.19),
(88000017, 1, 'Vidrio templado Xiaomi Note 12/Redmi 12', 'Vidrio templado para modelos de Xiaomi Note 12 y Redmi 12', 12000, 6000, 0.19),
(88000018, 1, 'Vidrio templado Xiaomi 9A/9C', 'Vidrio templado para modelos de Xiaomi 9A y 9C', 11000, 5500, 0.19),
-- Fundas para celulares (Categoría 7: Forros y Estuches)
(88000019, 7, 'Funda iPhone 6/XS', 'Funda para modelos de iPhone 6 y XS', 20000, 10000, 0.19),
(88000020, 7, 'Funda iPhone 11 pro', 'Funda para iPhone 11 Pro', 22000, 11000, 0.19),
(88000021, 7, 'Funda iPhone 12 mini/12/12 pro/12 pro max', 'Funda para varios modelos de iPhone 12', 25000, 12500, 0.19),
(88000022, 7, 'Funda iPhone 15 plus/16/16 pro/16 pro max/16 plus', 'Funda para varios modelos de iPhone 15 y 16', 30000, 15000, 0.19),
(88000023, 7, 'Funda Samsung A15/A16/A30', 'Funda para modelos de Samsung A15, A16 y A30', 20000, 10000, 0.19),
(88000024, 7, 'Funda Samsung A21s/A22/A54/A72', 'Funda para modelos de Samsung A21s, A22, A54 y A72', 22000, 11000, 0.19),
(88000025, 7, 'Funda Samsung A03/A02s/A23/A56', 'Funda para varios modelos de Samsung A', 21000, 10500, 0.19),
(88000026, 7, 'Funda Samsung S25 ultra', 'Funda para Samsung S25 Ultra', 28000, 14000, 0.19),
(88000027, 7, 'Funda Huawei Y9 2019', 'Funda para Huawei Y9 2019', 18000, 9000, 0.19),
(88000028, 7, 'Funda Xiaomi Redmi 10/Note 14/Note 10/13/Note 14 pro 5G', 'Funda para varios modelos de Xiaomi Redmi', 20000, 10000, 0.19),
(88000029, 7, 'Funda Motorola G34/G72', 'Funda para modelos de Motorola G34 y G72', 21000, 10500, 0.19),
(88000030, 7, 'Funda VIVO y32/y27/y3', 'Funda para varios modelos de VIVO Y', 19000, 9500, 0.19),
(88000031, 7, 'Funda Honor X8B', 'Funda para Honor X8B', 22000, 11000, 0.19);

-- Inserción en INVENTARIO (general)
INSERT INTO INVENTARIO (ID_PRODUCTO_INVENTARIO, EXISTENCIA_INVENTARIO, ESTADO_INVENTARIO) VALUES
(9001, 15, 'A'), (9002, 3, 'A'), (9003, 7, 'A'), (9004, 20, 'A'), (9005, 12, 'A'), (9006, 9, 'A'), (9007, 6, 'A'), (9008, 6, 'A'), (9009, 4, 'A'), (9010, 10, 'A'),
(9011, 12, 'A'), (9012, 12, 'A'), (9013, 5, 'A'), (9014, 15, 'A'), (9015, 12, 'A'), (9016, 20, 'A'), (9017, 5, 'A'), (9018, 12, 'A'),
(10001, 10, 'A'), (10002, 8, 'A'), (10003, 14, 'A'), (10004, 11, 'A'), (10005, 10, 'A'), (10006, 13, 'A'), (10007, 9, 'A'), (10008, 7, 'A'), (10009, 5, 'A'), (10010, 10, 'A'),
(10011, 12, 'A'), (10012, 6, 'A'), (10013, 11, 'A'), (10014, 15, 'A'), (10015, 10, 'A'),
(3001, 12, 'A'), (3002, 4, 'A'), (3003, 8, 'A'), (3004, 11, 'A'), (3005, 13, 'A'), (3006, 7, 'A'), (3007, 10, 'A'),
(11001, 20, 'A'), (11002, 18, 'A'),
(5001, 14, 'A'), (5002, 9, 'A'),
(12001, 5, 'A'), (12002, 15, 'A'), (12003, 18, 'A'), (12004, 12, 'A'), (12005, 10, 'A'), (12006, 8, 'A'), (12007, 5, 'A'), (12008, 15, 'A'), (12009, 12, 'A'),
(12010, 10, 'A'), (12011, 8, 'A'), (12012, 6, 'A'), (12013, 4, 'A'), (12014, 2, 'A'), (12015, 0, 'A');

-- Inserción en INVENTARIOLOCAL (distribución entre sedes 1 y 2)
INSERT INTO INVENTARIOLOCAL (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL) VALUES
-- Papelería
(9001, 1, 10, 5, 20), (9001, 2, 5, 2, 10),
(9002, 1, 3, 1, 5), (9003, 2, 7, 3, 10),
-- Cables y Adaptadores
(10001, 1, 6, 3, 15), (10001, 2, 4, 2, 10),
(10002, 1, 5, 2, 10), (10002, 2, 3, 1, 5),
(10003, 1, 8, 4, 15), (10003, 2, 6, 3, 10),
-- Cargadores
(3001, 1, 7, 3, 15), (3001, 2, 5, 2, 10),
(3002, 1, 2, 1, 5), (3002, 2, 2, 1, 5),
-- Tarjetas SIM
(11001, 1, 10, 5, 20), (11001, 2, 10, 5, 20),
-- Audífonos y Manos Libres
(5001, 1, 8, 4, 15), (5001, 2, 6, 3, 10),
-- Memorias y Almacenamiento
(12001, 1, 3, 1, 5), (12002, 1, 8, 4, 15), (12003, 2, 7, 3, 10), (12004, 1, 6, 3, 10),
(12005, 2, 5, 2, 8), (12006, 1, 4, 2, 6), (12007, 2, 5, 2, 8), (12014, 1, 2, 1, 3),
(12015, 1, 0, 0, 1);

--Fundas del celular 
-- Inserción en INVENTARIO (general)
INSERT INTO INVENTARIO (ID_PRODUCTO_INVENTARIO, EXISTENCIA_INVENTARIO, ESTADO_INVENTARIO) VALUES
(88000001, 15, 'A'), (88000002, 18, 'A'), (88000003, 12, 'A'), (88000004, 10, 'A'), (88000005, 16, 'A'), (88000006, 14, 'A'), (88000007, 18, 'A'), (88000008, 15, 'A'), (88000009, 17, 'A'), (88000010, 13, 'A'),
(88000011, 16, 'A'), (88000012, 14, 'A'), (88000013, 11, 'A'), (88000014, 13, 'A'), (88000015, 10, 'A'), (88000016, 12, 'A'), (88000017, 15, 'A'), (88000018, 14, 'A'),
(88000019, 18, 'A'), (88000020, 15, 'A'), (88000021, 19, 'A'), (88000022, 16, 'A'), (88000023, 14, 'A'), (88000024, 11, 'A'), (88000025, 13, 'A'), (88000026, 10, 'A'), (88000027, 12, 'A'),
(88000028, 15, 'A'), (88000029, 13, 'A'), (88000030, 10, 'A'), (88000031, 11, 'A');

-- Inserción en INVENTARIOLOCAL (distribución entre sedes 1 y 2)
INSERT INTO INVENTARIOLOCAL (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMINIMO_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL) VALUES
-- Vidrios Templados
(88000001, 1, 8, 2, 15), (88000001, 2, 7, 2, 10),
(88000002, 1, 10, 4, 20), (88000002, 2, 8, 3, 15),
(88000003, 1, 6, 2, 12), (88000004, 2, 10, 3, 15),
(88000005, 1, 9, 3, 15), (88000005, 2, 7, 2, 12),
(88000006, 1, 8, 3, 14), (88000007, 2, 10, 4, 18),
(88000008, 1, 7, 2, 15), (88000009, 2, 9, 3, 16),
(88000010, 1, 6, 2, 13), (88000011, 2, 8, 3, 16),
(88000012, 1, 7, 2, 14), (88000013, 2, 5, 2, 11),
(88000014, 1, 6, 2, 13), (88000015, 2, 5, 2, 10),
(88000016, 1, 6, 2, 12), (88000017, 2, 8, 3, 15),
(88000018, 1, 7, 2, 14),
-- Fundas para celulares
(88000019, 1, 10, 4, 18), (88000019, 2, 8, 3, 15),
(88000020, 1, 8, 3, 15), (88000021, 2, 10, 4, 20),
(88000022, 1, 9, 3, 16), (88000022, 2, 7, 2, 12),
(88000023, 1, 8, 3, 14), (88000024, 2, 6, 2, 11),
(88000025, 1, 7, 2, 13), (88000026, 2, 5, 2, 10),
(88000027, 1, 6, 2, 12), (88000028, 2, 8, 3, 15),
(88000029, 1, 7, 2, 13), (88000030, 2, 5, 2, 10),
(88000031, 1, 6, 2, 11);