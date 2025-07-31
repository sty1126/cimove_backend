import { pool } from "../../db.js";

// Productos
export const obtenerTopProductosPorCantidad = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto, 
      SUM(DF.CANTVENDIDA_DETALLEFACTURA) AS total_vendido
    FROM DETALLEFACTURA DF
    JOIN PRODUCTO P ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    GROUP BY P.nombre_producto
    ORDER BY total_vendido DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerTopProductosPorValor = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto, 
      SUM(DF.CANTVENDIDA_DETALLEFACTURA * DF.PRECIOVENTA_DETALLEFACTURA) AS total_valor
    FROM DETALLEFACTURA DF
    JOIN PRODUCTO P ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    GROUP BY P.nombre_producto
    ORDER BY total_valor DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerProductosMasFrecuentes = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto, 
      COUNT(*) AS frecuencia_venta
    FROM DETALLEFACTURA DF
    JOIN PRODUCTO P ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    GROUP BY P.nombre_producto
    ORDER BY frecuencia_venta DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerStockVsVentas = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto,
      IL.EXISTENCIA_INVENTARIOLOCAL AS stock_actual,
      COALESCE(SUM(DF.CANTVENDIDA_DETALLEFACTURA), 0) AS total_vendido
    FROM PRODUCTO P
    LEFT JOIN DETALLEFACTURA DF ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    LEFT JOIN INVENTARIOLOCAL IL ON P.id_producto = IL.ID_PRODUCTO_INVENTARIOLOCAL
    GROUP BY P.nombre_producto, IL.EXISTENCIA_INVENTARIOLOCAL
    ORDER BY total_vendido DESC
  `);
  return result.rows;
};

export const obtenerProductosBajoStockAltaDemanda = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto,
      P.stock_producto,
      COALESCE(SUM(DF.CANTVENDIDA_DETALLEFACTURA), 0) AS total_vendido
    FROM PRODUCTO P
    LEFT JOIN DETALLEFACTURA DF ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    GROUP BY P.nombre_producto, P.stock_producto
    HAVING P.stock_producto < 10 AND SUM(DF.CANTVENDIDA_DETALLEFACTURA) > 20
    ORDER BY total_vendido DESC
  `);
  return result.rows;
};

export const obtenerProductosObsoletos = async () => {
  const result = await pool.query(`
    SELECT 
      P.nombre_producto,
      COALESCE(SUM(DF.CANTVENDIDA_DETALLEFACTURA), 0) AS total_vendido
    FROM PRODUCTO P
    LEFT JOIN DETALLEFACTURA DF ON P.id_producto = DF.ID_PRODUCTO_DETALLEFACTURA
    GROUP BY P.nombre_producto
    ORDER BY total_vendido ASC
    LIMIT 10
  `);
  return result.rows;
};

// Clientes
export const obtenerTopClientesPorMonto = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE) AS nombre_cliente,
      SUM(F.TOTAL_FACTURA) AS total_compras
    FROM FACTURA F
    JOIN CLIENTE C ON C.ID_CLIENTE = F.ID_CLIENTE_FACTURA
    LEFT JOIN CLIENTENATURAL CN ON CN.ID_CLIENTE = C.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.ID_CLIENTE = C.ID_CLIENTE
    GROUP BY COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE)
    ORDER BY total_compras DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerTopClientesPorCantidad = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE) AS nombre_cliente,
      COUNT(*) AS cantidad_compras
    FROM FACTURA F
    JOIN CLIENTE C ON C.ID_CLIENTE = F.ID_CLIENTE_FACTURA
    LEFT JOIN CLIENTENATURAL CN ON CN.ID_CLIENTE = C.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.ID_CLIENTE = C.ID_CLIENTE
    GROUP BY COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE)
    ORDER BY cantidad_compras DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerTopClientesPorFrecuencia = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE) AS nombre_cliente,
      COUNT(DISTINCT DATE(F.FECHA_FACTURA)) AS dias_con_compra
    FROM FACTURA F
    JOIN CLIENTE C ON C.ID_CLIENTE = F.ID_CLIENTE_FACTURA
    LEFT JOIN CLIENTENATURAL CN ON CN.ID_CLIENTE = C.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.ID_CLIENTE = C.ID_CLIENTE
    GROUP BY COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE)
    ORDER BY dias_con_compra DESC
    LIMIT 10
  `);
  return result.rows;
};

export const obtenerClientesFrecuentesVsEsporadicos = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE) AS nombre_cliente,
      COUNT(DISTINCT DATE(F.FECHA_FACTURA)) AS dias_con_compra,
      CASE 
        WHEN COUNT(DISTINCT DATE(F.FECHA_FACTURA)) > 3 THEN 'Frecuente'
        ELSE 'Esporádico'
      END AS tipo_cliente
    FROM FACTURA F
    JOIN CLIENTE C ON C.ID_CLIENTE = F.ID_CLIENTE_FACTURA
    LEFT JOIN CLIENTENATURAL CN ON CN.ID_CLIENTE = C.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.ID_CLIENTE = C.ID_CLIENTE
    GROUP BY COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE)
    ORDER BY dias_con_compra DESC
  `);
  return result.rows;
};

export const obtenerClientesConPagosPendientes = async () => {
  const result = await pool.query(`
    SELECT 
      COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE) AS nombre_cliente,
      COUNT(*) AS facturas_pendientes,
      SUM(F.SALDO_FACTURA) AS total_pendiente
    FROM FACTURA F
    JOIN CLIENTE C ON C.ID_CLIENTE = F.ID_CLIENTE_FACTURA
    LEFT JOIN CLIENTENATURAL CN ON CN.ID_CLIENTE = C.ID_CLIENTE
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.ID_CLIENTE = C.ID_CLIENTE
    WHERE F.SALDO_FACTURA > 0
    GROUP BY COALESCE(CN.NOMBRE_CLIENTE || ' ' || CN.APELLIDO_CLIENTE, CJ.RAZONSOCIAL_CLIENTE)
    ORDER BY total_pendiente DESC
  `);
  return result.rows;
};

// Ingresos
export const obtenerIngresosPorDia = async () => {
  const result = await pool.query(`
    SELECT 
      DATE(FECHA_FACTURA) AS fecha, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= CURRENT_DATE - INTERVAL '20 days'
    GROUP BY fecha
    ORDER BY fecha DESC;
  `);
  return result.rows;
};

export const obtenerIngresosPorMes = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', FECHA_FACTURA) AS mes, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
    GROUP BY mes
    ORDER BY mes DESC;
  `);
  return result.rows;
};

export const obtenerIngresosPorAnio = async () => {
  const result = await pool.query(`
    SELECT 
      DATE_TRUNC('year', FECHA_FACTURA) AS año, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '5 years')
    GROUP BY año
    ORDER BY año DESC;
  `);
  return result.rows;
};

export const obtenerTotalFacturado = async () => {
  const result = await pool.query(`
    SELECT SUM(TOTAL_FACTURA) AS total_facturado FROM FACTURA
  `);
  return result.rows[0];
};

export const obtenerTotalPagado = async () => {
  const result = await pool.query(`
    SELECT 
      TMP.NOMBRE_TIPOMETODOPAGO AS metodo_pago,
      SUM(M.MONTO_METODOPAGO) AS total_pagado
    FROM METODOPAGO M
    JOIN TIPOMETODOPAGO TMP ON TMP.ID_TIPOMETODOPAGO = M.ID_TIPOMETODOPAGO_METODOPAGO
    WHERE M.ESTADO_METODOPAGO = 'A'
    GROUP BY TMP.NOMBRE_TIPOMETODOPAGO
    ORDER BY total_pagado DESC;
  `);
  return result.rows[0];
};

export const obtenerIngresosPorMetodoPago = async () => {
  const result = await pool.query(`
    SELECT 
      TMP.NOMBRE_TIPOMETODOPAGO AS metodo,
      TMP.COMISION_TIPOMETODOPAGO AS comision,
      SUM(M.MONTO_METODOPAGO) AS total
    FROM METODOPAGO M
    JOIN TIPOMETODOPAGO TMP ON TMP.ID_TIPOMETODOPAGO = M.ID_TIPOMETODOPAGO_METODOPAGO
    WHERE M.ESTADO_METODOPAGO = 'A'
    GROUP BY TMP.NOMBRE_TIPOMETODOPAGO, TMP.COMISION_TIPOMETODOPAGO
    ORDER BY total DESC
  `);
  return result.rows;
};

export const obtenerComparacionFacturadoRecibido = async () => {
  const result = await pool.query(`
    SELECT 
      (SELECT SUM(TOTAL_FACTURA) FROM FACTURA) AS total_facturado,
      (SELECT SUM(MONTO_METODOPAGO) FROM METODOPAGO WHERE ESTADO_METODOPAGO = 'A') AS total_recibido
  `);
  return result.rows[0];
};

//Sedes
export const obtenerVentasPorSede = async () => {
  const result = await pool.query(`
    SELECT S.NOMBRE_SEDE, SUM(F.TOTAL_FACTURA) AS total_ventas
    FROM FACTURA F
    JOIN SEDE S ON S.ID_SEDE = F.ID_SEDE_FACTURA
    GROUP BY S.NOMBRE_SEDE
    ORDER BY total_ventas DESC
  `);
  return result.rows;
};

export const obtenerVentasPorSedePorAnio = async () => {
  const result = await pool.query(`
    SELECT 
      S.NOMBRE_SEDE,
      EXTRACT(YEAR FROM F.FECHA_FACTURA) AS anio,
      SUM(F.TOTAL_FACTURA) AS total_ventas
    FROM FACTURA F
    JOIN SEDE S ON S.ID_SEDE = F.ID_SEDE_FACTURA
    WHERE F.FECHA_FACTURA >= NOW() - INTERVAL '3 years'
    GROUP BY S.NOMBRE_SEDE, anio
    ORDER BY anio DESC, total_ventas DESC
  `);
  return result.rows;
};

export const obtenerVentasPorSedePorMes = async () => {
  const result = await pool.query(`
    SELECT 
      S.NOMBRE_SEDE,
      TO_CHAR(F.FECHA_FACTURA, 'YYYY-MM') AS mes,
      SUM(F.TOTAL_FACTURA) AS total_ventas
    FROM FACTURA F
    JOIN SEDE S ON S.ID_SEDE = F.ID_SEDE_FACTURA
    WHERE F.FECHA_FACTURA >= NOW() - INTERVAL '6 months'
    GROUP BY S.NOMBRE_SEDE, mes
    ORDER BY mes DESC, total_ventas DESC
  `);
  return result.rows;
};

export const obtenerVentasPorSedePorDia = async () => {
  const result = await pool.query(`
    SELECT 
      S.NOMBRE_SEDE,
      TO_CHAR(F.FECHA_FACTURA, 'YYYY-MM-DD') AS dia,
      SUM(F.TOTAL_FACTURA) AS total_ventas
    FROM FACTURA F
    JOIN SEDE S ON S.ID_SEDE = F.ID_SEDE_FACTURA
    WHERE F.FECHA_FACTURA >= NOW() - INTERVAL '10 days'
    GROUP BY S.NOMBRE_SEDE, dia
    ORDER BY dia DESC, total_ventas DESC
  `);
  return result.rows;
};

// Proveedores
export const obtenerPagosProveedoresTotales = async () => {
  const result = await pool.query(`
    SELECT SUM(MONTO_ABONOFACTURA) AS total_pagado_proveedores
    FROM ABONOFACTURA
  `);
  return result.rows[0];
};

export const obtenerPagosPorProveedor = async () => {
  const result = await pool.query(`
    SELECT P.NOMBRE_PROVEEDOR, SUM(A.MONTO_ABONOFACTURA) AS total_pagado
    FROM ABONOFACTURA A
    JOIN FACTURAPROVEEDOR FP ON FP.ID_FACTURAPROVEEDOR = A.ID_FACTURAPROVEEDOR_ABONOFACTURA
    JOIN PROVEEDOR P ON P.ID_PROVEEDOR = FP.ID_PROVEEDOR_FACTURAPROVEEDOR
    GROUP BY P.NOMBRE_PROVEEDOR
    ORDER BY total_pagado DESC
  `);
  return result.rows;
};

export const obtenerPagosProveedoresPorMes = async () => {
  const result = await pool.query(`
    SELECT DATE_TRUNC('month', FECHA_ABONOFACTURA) AS mes, SUM(MONTO_ABONOFACTURA) AS total
    FROM ABONOFACTURA
    GROUP BY mes
    ORDER BY mes DESC
  `);
  return result.rows;
};

// Nómina
export const obtenerNominaPorSedeYRol = async () => {
  const result = await pool.query(`
    SELECT 
      S.NOMBRE_SEDE, 
      TU.DESCRIPCION_TIPOUSUARIO AS rol, 
      SUM(PS.MONTO_SALARIO) AS total
    FROM SALARIO PS
    JOIN EMPLEADO E ON E.ID_EMPLEADO = PS.ID_EMPLEADO_SALARIO
    JOIN USUARIO U ON U.ID_EMPLEADO_USUARIO = E.ID_EMPLEADO
    JOIN TIPOUSUARIO TU ON TU.ID_TIPOUSUARIO = U.ID_TIPOUSUARIO_USUARIO
    JOIN SEDE S ON S.ID_SEDE = E.ID_SEDE_EMPLEADO
    GROUP BY S.NOMBRE_SEDE, TU.DESCRIPCION_TIPOUSUARIO
    ORDER BY total DESC;
  `);
  return result.rows;
};