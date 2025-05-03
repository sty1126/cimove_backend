import { pool } from "../db.js";

// 1. Top 10 productos más vendidos por cantidad
export const getTopProductosPorCantidad = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getTopProductosPorCantidad:", error);
    res
      .status(500)
      .json({ error: "Error al obtener productos más vendidos por cantidad" });
  }
};

// 2. Top 10 productos por valor total (cantidad * precio_unitario)
export const getTopProductosPorValor = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getTopProductosPorValor:", error);
    res
      .status(500)
      .json({ error: "Error al obtener productos por valor total" });
  }
};

// 3. Productos con más rotación (frecuencia de venta)
export const getProductosMasFrecuentes = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getProductosMasFrecuentes:", error);
    res
      .status(500)
      .json({ error: "Error al obtener frecuencia de venta de productos" });
  }
};

// 4. Stock actual vs ventas
export const getStockVsVentas = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getStockVsVentas:", error);
    res
      .status(500)
      .json({ error: "Error al obtener comparación de stock vs ventas" });
  }
};

// 5. Productos con bajo stock y alta demanda
export const getProductosBajoStockAltaDemanda = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getProductosBajoStockAltaDemanda:", error);
    res.status(500).json({
      error: "Error al obtener productos con bajo stock y alta demanda",
    });
  }
};

// 6. Productos obsoletos (menos vendidos)
export const getProductosObsoletos = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getProductosObsoletos:", error);
    res.status(500).json({ error: "Error al obtener productos obsoletos" });
  }
};

// 1. Top clientes por monto total de compras
export const getTopClientesPorMonto = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getTopClientesPorMonto:", error);
    res
      .status(500)
      .json({ error: "Error al obtener clientes por monto total de compras" });
  }
};

// 2. Top clientes por cantidad de compras
export const getTopClientesPorCantidad = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getTopClientesPorCantidad:", error);
    res
      .status(500)
      .json({ error: "Error al obtener clientes por cantidad de compras" });
  }
};

// 3. Top clientes por frecuencia de compra (días distintos)
export const getTopClientesPorFrecuencia = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getTopClientesPorFrecuencia:", error);
    res
      .status(500)
      .json({ error: "Error al obtener clientes por frecuencia de compra" });
  }
};

// 4. Clientes frecuentes vs esporádicos
export const getClientesFrecuentesVsEsporadicos = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getClientesFrecuentesVsEsporadicos:", error);
    res
      .status(500)
      .json({ error: "Error al clasificar clientes frecuentes y esporádicos" });
  }
};

// 5. Clientes con pagos pendientes
export const getClientesConPagosPendientes = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getClientesConPagosPendientes:", error);
    res
      .status(500)
      .json({ error: "Error al obtener clientes con pagos pendientes" });
  }
};

// 1. Ingresos por día
export const getIngresosPorDia = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
    DATE(FECHA_FACTURA) AS fecha, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= CURRENT_DATE - INTERVAL '20 days'
    GROUP BY fecha
    ORDER BY fecha DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getIngresosPorDia:", error);
    res.status(500).json({ error: "Error al obtener ingresos por día" });
  }
};

// 2. Ingresos por mes
export const getIngresosPorMes = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
      DATE_TRUNC('month', FECHA_FACTURA) AS mes, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '6 months')
    GROUP BY mes
    ORDER BY mes DESC;
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getIngresosPorMes:", error);
    res.status(500).json({ error: "Error al obtener ingresos por mes" });
  }
};

// 3. Ingresos por año
export const getIngresosPorAnio = async (req, res) => {
  try {
    const result = await pool.query(`
    SELECT 
      DATE_TRUNC('year', FECHA_FACTURA) AS año, 
      SUM(TOTAL_FACTURA) AS total
    FROM FACTURA
    WHERE FECHA_FACTURA >= DATE_TRUNC('year', CURRENT_DATE - INTERVAL '5 years')
    GROUP BY año
    ORDER BY año DESC;

    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getIngresosPorAnio:", error);
    res.status(500).json({ error: "Error al obtener ingresos por año" });
  }
};

// 4. Ingresos totales (facturados)
export const getTotalFacturado = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT SUM(TOTAL_FACTURA) AS total_facturado FROM FACTURA
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getTotalFacturado:", error);
    res.status(500).json({ error: "Error al obtener total facturado" });
  }
};

// 5. Ingresos reales (pagados)
export const getTotalPagado = async (req, res) => {
  try {
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
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getTotalPagado:", error);
    res.status(500).json({ error: "Error al obtener total pagado" });
  }
};

// 6. Ingresos por método de pago
export const getIngresosPorMetodoPago = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT TMP.NOMBRE_TIPOMETODOPAGO AS metodo,
             SUM(M.MONTO_METODOPAGO) AS total
      FROM METODOPAGO M
      JOIN TIPOMETODOPAGO TMP ON TMP.ID_TIPOMETODOPAGO = M.ID_TIPOMETODOPAGO_METODOPAGO
      WHERE M.ESTADO_METODOPAGO = 'A'
      GROUP BY metodo
      ORDER BY total DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getIngresosPorMetodoPago:", error);
    res
      .status(500)
      .json({ error: "Error al obtener ingresos por método de pago" });
  }
};

// 7. Total facturado vs total recibido
export const getComparacionFacturadoRecibido = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        (SELECT SUM(TOTAL_FACTURA) FROM FACTURA) AS total_facturado,
        (SELECT SUM(MONTO_METODOPAGO) FROM METODOPAGO WHERE ESTADO_METODOPAGO = 'A') AS total_recibido
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getComparacionFacturadoRecibido:", error);
    res.status(500).json({ error: "Error al comparar facturado vs recibido" });
  }
};

// 8. Ventas por sede
export const getVentasPorSede = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT S.NOMBRE_SEDE, SUM(F.TOTAL_FACTURA) AS total_ventas
      FROM FACTURA F
      JOIN SEDE S ON S.ID_SEDE = F.ID_SEDE_FACTURA
      GROUP BY S.NOMBRE_SEDE
      ORDER BY total_ventas DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getVentasPorSede:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede" });
  }
};

// 1. Pagos a proveedores - Totales
export const getPagosProveedoresTotales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT SUM(MONTO_ABONOFACTURA) AS total_pagado_proveedores
      FROM ABONOFACTURA
    `);
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error en getPagosProveedoresTotales:", error);
    res
      .status(500)
      .json({ error: "Error al obtener pagos totales a proveedores" });
  }
};

// 2. Pagos a proveedores por proveedor
export const getPagosPorProveedor = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT P.NOMBRE_PROVEEDOR, SUM(A.MONTO_ABONOFACTURA) AS total_pagado
      FROM ABONOFACTURA A
      JOIN FACTURAPROVEEDOR FP ON FP.ID_FACTURAPROVEEDOR = A.ID_FACTURAPROVEEDOR_ABONOFACTURA
      JOIN PROVEEDOR P ON P.ID_PROVEEDOR = FP.ID_PROVEEDOR_FACTURAPROVEEDOR
      GROUP BY P.NOMBRE_PROVEEDOR
      ORDER BY total_pagado DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getPagosPorProveedor:", error);
    res.status(500).json({ error: "Error al obtener pagos por proveedor" });
  }
};

// 3. Pagos a proveedores por mes
export const getPagosProveedoresPorMes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT DATE_TRUNC('month', FECHA_ABONOFACTURA) AS mes, SUM(MONTO_ABONOFACTURA) AS total
      FROM ABONOFACTURA
      GROUP BY mes
      ORDER BY mes DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getPagosProveedoresPorMes:", error);
    res
      .status(500)
      .json({ error: "Error al obtener pagos a proveedores por mes" });
  }
};

// 5. Nómina por sede y rol
export const getNominaPorSedeYRol = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getNominaPorSedeYRol:", error);
    res.status(500).json({ error: "Error al obtener nómina por sede y rol" });
  }
};

export const getVentasPorSedePorAnio = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getVentasPorSedePorAnio:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede por año" });
  }
};

export const getVentasPorSedePorMes = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getVentasPorSedePorMes:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede por mes" });
  }
};

export const getVentasPorSedePorDia = async (req, res) => {
  try {
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
    res.json(result.rows);
  } catch (error) {
    console.error("Error en getVentasPorSedePorDia:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede por día" });
  }
};
