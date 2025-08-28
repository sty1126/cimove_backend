import { pool } from "../../db.js";

// ESTADÍSTICAS DE PRODUCTOS

export const obtenerTopProductosPorCantidad = async (limite = 10) => {
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      COALESCE(SUM(df.cantvendida_detallefactura), 0) AS total_vendido
    FROM 
      producto p
    LEFT JOIN 
      detallefactura df ON p.id_producto = df.id_producto_detallefactura AND df.estado_detallefactura = 'A'
    LEFT JOIN 
      factura f ON df.id_factura_detallefactura = f.id_factura AND f.estado_factura = 'A'
    WHERE 
      p.estado_producto = 'A'
    GROUP BY 
      p.id_producto, p.nombre_producto
    ORDER BY 
      total_vendido DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerTopProductosPorValor = async (limite = 10) => {
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      COALESCE(SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura), 0) AS total_valor
    FROM 
      producto p
    LEFT JOIN 
      detallefactura df ON p.id_producto = df.id_producto_detallefactura AND df.estado_detallefactura = 'A'
    LEFT JOIN 
      factura f ON df.id_factura_detallefactura = f.id_factura AND f.estado_factura = 'A'
    WHERE 
      p.estado_producto = 'A'
    GROUP BY 
      p.id_producto, p.nombre_producto
    ORDER BY 
      total_valor DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerProductosFrecuentes = async (limite = 10) => {
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      COUNT(DISTINCT f.id_factura) AS frecuencia_compra
    FROM 
      producto p
    INNER JOIN 
      detallefactura df ON p.id_producto = df.id_producto_detallefactura AND df.estado_detallefactura = 'A'
    INNER JOIN 
      factura f ON df.id_factura_detallefactura = f.id_factura AND f.estado_factura = 'A'
    WHERE 
      p.estado_producto = 'A'
    GROUP BY 
      p.id_producto, p.nombre_producto
    ORDER BY 
      frecuencia_compra DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerStockVsVentas = async (limite = 100) => {
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      COALESCE(SUM(il.existencia_inventariolocal), 0) AS stock_actual,
      COALESCE(SUM(df.cantvendida_detallefactura), 0) AS total_vendido
    FROM 
      producto p
    LEFT JOIN 
      inventariolocal il ON p.id_producto = il.id_producto_inventariolocal AND il.estado_inventariolocal = 'A'
    LEFT JOIN 
      detallefactura df ON p.id_producto = df.id_producto_detallefactura AND df.estado_detallefactura = 'A'
    LEFT JOIN 
      factura f ON df.id_factura_detallefactura = f.id_factura AND f.estado_factura = 'A'
    WHERE 
      p.estado_producto = 'A'
    GROUP BY 
      p.id_producto, p.nombre_producto
    ORDER BY 
      p.nombre_producto
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerProductosObsoletos = async (diasSinVenta = 90, limite = 20) => {
  const fechaLimite = new Date();
  fechaLimite.setDate(fechaLimite.getDate() - diasSinVenta);
  
  const query = `
    SELECT 
      p.id_producto,
      p.nombre_producto,
      COALESCE(SUM(il.existencia_inventariolocal), 0) AS stock_actual,
      COALESCE(MAX(f.fecha_factura), NULL) AS ultima_venta
    FROM 
      producto p
    LEFT JOIN 
      inventariolocal il ON p.id_producto = il.id_producto_inventariolocal AND il.estado_inventariolocal = 'A'
    LEFT JOIN 
      detallefactura df ON p.id_producto = df.id_producto_detallefactura AND df.estado_detallefactura = 'A'
    LEFT JOIN 
      factura f ON df.id_factura_detallefactura = f.id_factura AND f.estado_factura = 'A'
    WHERE 
      p.estado_producto = 'A'
    GROUP BY 
      p.id_producto, p.nombre_producto
    HAVING 
      MAX(f.fecha_factura) IS NULL OR MAX(f.fecha_factura) < $1
    ORDER BY 
      ultima_venta ASC NULLS FIRST, stock_actual DESC
    LIMIT $2
  `;
  
  const result = await pool.query(query, [fechaLimite, limite]);
  return result.rows;
};

// ESTADÍSTICAS DE CLIENTES

export const obtenerTopClientesPorMonto = async (limite = 10) => {
  const query = `
    WITH cliente_info AS (
      SELECT 
        c.id_cliente,
        CASE
          WHEN cn.id_cliente IS NOT NULL THEN CONCAT(cn.nombre_cliente, ' ', cn.apellido_cliente)
          WHEN cj.id_cliente IS NOT NULL THEN cj.razonsocial_cliente
          ELSE 'Cliente ' || c.id_cliente
        END AS nombre_cliente
      FROM 
        cliente c
      LEFT JOIN 
        clientenatural cn ON c.id_cliente = cn.id_cliente AND cn.estado_cliente = 'A'
      LEFT JOIN 
        clientejuridico cj ON c.id_cliente = cj.id_cliente AND cj.estado_cliente = 'A'
      WHERE 
        c.estado_cliente = 'A'
    )
    SELECT 
      ci.id_cliente,
      ci.nombre_cliente,
      COALESCE(SUM(f.total_factura), 0) AS total_compras
    FROM 
      cliente_info ci
    LEFT JOIN 
      factura f ON ci.id_cliente = f.id_cliente_factura AND f.estado_factura = 'A'
    GROUP BY 
      ci.id_cliente, ci.nombre_cliente
    ORDER BY 
      total_compras DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerTopClientesPorCantidad = async (limite = 10) => {
  const query = `
    WITH cliente_info AS (
      SELECT 
        c.id_cliente,
        CASE
          WHEN cn.id_cliente IS NOT NULL THEN CONCAT(cn.nombre_cliente, ' ', cn.apellido_cliente)
          WHEN cj.id_cliente IS NOT NULL THEN cj.razonsocial_cliente
          ELSE 'Cliente ' || c.id_cliente
        END AS nombre_cliente
      FROM 
        cliente c
      LEFT JOIN 
        clientenatural cn ON c.id_cliente = cn.id_cliente AND cn.estado_cliente = 'A'
      LEFT JOIN 
        clientejuridico cj ON c.id_cliente = cj.id_cliente AND cj.estado_cliente = 'A'
      WHERE 
        c.estado_cliente = 'A'
    )
    SELECT 
      ci.id_cliente,
      ci.nombre_cliente,
      COUNT(f.id_factura) AS total_facturas
    FROM 
      cliente_info ci
    LEFT JOIN 
      factura f ON ci.id_cliente = f.id_cliente_factura AND f.estado_factura = 'A'
    GROUP BY 
      ci.id_cliente, ci.nombre_cliente
    ORDER BY 
      total_facturas DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerTopClientesPorFrecuencia = async (limite = 10, periodoMeses = 6) => {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - periodoMeses);
  
  const query = `
    WITH cliente_info AS (
      SELECT 
        c.id_cliente,
        CASE
          WHEN cn.id_cliente IS NOT NULL THEN CONCAT(cn.nombre_cliente, ' ', cn.apellido_cliente)
          WHEN cj.id_cliente IS NOT NULL THEN cj.razonsocial_cliente
          ELSE 'Cliente ' || c.id_cliente
        END AS nombre_cliente
      FROM 
        cliente c
      LEFT JOIN 
        clientenatural cn ON c.id_cliente = cn.id_cliente AND cn.estado_cliente = 'A'
      LEFT JOIN 
        clientejuridico cj ON c.id_cliente = cj.id_cliente AND cj.estado_cliente = 'A'
      WHERE 
        c.estado_cliente = 'A'
    ),
    cliente_compras AS (
      SELECT 
        ci.id_cliente,
        ci.nombre_cliente,
        COUNT(f.id_factura) AS total_facturas,
        MAX(f.fecha_factura) AS ultima_compra,
        MIN(f.fecha_factura) AS primera_compra
      FROM 
        cliente_info ci
      INNER JOIN 
        factura f ON ci.id_cliente = f.id_cliente_factura AND f.estado_factura = 'A'
      WHERE 
        f.fecha_factura >= $2
      GROUP BY 
        ci.id_cliente, ci.nombre_cliente
      HAVING 
        COUNT(f.id_factura) > 1
    )
    SELECT 
      id_cliente,
      nombre_cliente,
      total_facturas,
      ultima_compra,
      primera_compra,
      CASE 
        WHEN (ultima_compra - primera_compra) = 0 THEN total_facturas
        ELSE total_facturas::float / (EXTRACT(DAY FROM (ultima_compra - primera_compra)) / 30)
      END AS frecuencia_mensual
    FROM 
      cliente_compras
    ORDER BY 
      frecuencia_mensual DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite, fechaLimite]);
  return result.rows;
};

export const obtenerClientesFrecuentesVsEsporadicos = async (limite = 50, periodoMeses = 3) => {
  const fechaLimite = new Date();
  fechaLimite.setMonth(fechaLimite.getMonth() - periodoMeses);
  
  const query = `
    WITH cliente_info AS (
      SELECT 
        c.id_cliente,
        CASE
          WHEN cn.id_cliente IS NOT NULL THEN CONCAT(cn.nombre_cliente, ' ', cn.apellido_cliente)
          WHEN cj.id_cliente IS NOT NULL THEN cj.razonsocial_cliente
          ELSE 'Cliente ' || c.id_cliente
        END AS nombre_cliente
      FROM 
        cliente c
      LEFT JOIN 
        clientenatural cn ON c.id_cliente = cn.id_cliente AND cn.estado_cliente = 'A'
      LEFT JOIN 
        clientejuridico cj ON c.id_cliente = cj.id_cliente AND cj.estado_cliente = 'A'
      WHERE 
        c.estado_cliente = 'A'
    ),
    cliente_actividad AS (
      SELECT 
        ci.id_cliente,
        ci.nombre_cliente,
        COUNT(f.id_factura) AS total_compras,
        MAX(f.fecha_factura) AS ultima_compra,
        SUM(f.total_factura) AS total_gastado
      FROM 
        cliente_info ci
      LEFT JOIN 
        factura f ON ci.id_cliente = f.id_cliente_factura AND f.estado_factura = 'A'
      GROUP BY 
        ci.id_cliente, ci.nombre_cliente
    )
    SELECT 
      id_cliente,
      nombre_cliente,
      total_compras,
      ultima_compra,
      total_gastado,
      CASE 
        WHEN ultima_compra >= $2 AND total_compras >= 3 THEN 'Frecuente'
        WHEN ultima_compra >= $2 THEN 'Reciente'
        WHEN ultima_compra < $2 AND total_compras >= 3 THEN 'Inactivo'
        ELSE 'Esporádico'
      END AS tipo_cliente
    FROM 
      cliente_actividad
    ORDER BY 
      CASE 
        WHEN ultima_compra >= $2 THEN 0 
        ELSE 1 
      END,
      total_compras DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite, fechaLimite]);
  return result.rows;
};

export const obtenerClientesConPagosPendientes = async (limite = 20) => {
  const query = `
    WITH cliente_info AS (
      SELECT 
        c.id_cliente,
        CASE
          WHEN cn.id_cliente IS NOT NULL THEN CONCAT(cn.nombre_cliente, ' ', cn.apellido_cliente)
          WHEN cj.id_cliente IS NOT NULL THEN cj.razonsocial_cliente
          ELSE 'Cliente ' || c.id_cliente
        END AS nombre_cliente
      FROM 
        cliente c
      LEFT JOIN 
        clientenatural cn ON c.id_cliente = cn.id_cliente AND cn.estado_cliente = 'A'
      LEFT JOIN 
        clientejuridico cj ON c.id_cliente = cj.id_cliente AND cj.estado_cliente = 'A'
      WHERE 
        c.estado_cliente = 'A'
    )
    SELECT 
      ci.id_cliente,
      ci.nombre_cliente,
      COUNT(f.id_factura) FILTER (WHERE f.saldo_factura > 0) AS facturas_pendientes,
      SUM(f.saldo_factura) AS total_pendiente
    FROM 
      cliente_info ci
    INNER JOIN 
      factura f ON ci.id_cliente = f.id_cliente_factura AND f.estado_factura = 'A'
        GROUP BY 
      ci.id_cliente, ci.nombre_cliente
    HAVING 
      SUM(f.saldo_factura) > 0
    ORDER BY 
      total_pendiente DESC
    LIMIT $1
  `;
  
  const result = await pool.query(query, [limite]);
  return result.rows;
};

export const obtenerIngresosTotales = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      COALESCE(SUM(f.total_factura), 0) as ingresos_totales,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      factura f
    WHERE 
      f.estado_factura = 'A'
      ${fechaInicio ? `AND f.fecha_factura >= $1` : ''}
      ${fechaFin ? `AND f.fecha_factura <= $2` : ''}
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows[0];
};

export const obtenerIngresosPorDia = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      f.fecha_factura as fecha,
      COALESCE(SUM(f.total_factura), 0) as total_ingresos,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      factura f
    WHERE 
      f.estado_factura = 'A'
      ${fechaInicio ? `AND f.fecha_factura >= $1` : ''}
      ${fechaFin ? `AND f.fecha_factura <= $2` : ''}
    GROUP BY 
      f.fecha_factura
    ORDER BY 
      f.fecha_factura
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows;
};

export const obtenerIngresosPorMes = async (anio) => {
  const query = `
    SELECT 
      EXTRACT(MONTH FROM f.fecha_factura) as mes,
      COALESCE(SUM(f.total_factura), 0) as total_ingresos,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      factura f
    WHERE 
      f.estado_factura = 'A'
      AND EXTRACT(YEAR FROM f.fecha_factura) = $1
    GROUP BY 
      EXTRACT(MONTH FROM f.fecha_factura)
    ORDER BY 
      mes
  `;

  const result = await pool.query(query, [anio]);
  return result.rows;
};

export const obtenerIngresosPorMetodoPago = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      tmp.nombre_tipometodopago as metodo_pago,
      COALESCE(SUM(mp.monto_metodopago), 0) as total_ingresos,
      COUNT(mp.id_metodopago) as cantidad_pagos
    FROM 
      metodopago mp
    JOIN 
      tipometodopago tmp ON mp.id_tipometodopago_metodopago = tmp.id_tipometodopago
    JOIN 
      factura f ON mp.id_factura_metodopago = f.id_factura
    WHERE 
      mp.estado_metodopago = 'A' AND
      f.estado_factura = 'A'
      ${fechaInicio ? `AND f.fecha_factura >= $1` : ''}
      ${fechaFin ? `AND f.fecha_factura <= $2` : ''}
    GROUP BY 
      tmp.nombre_tipometodopago
    ORDER BY 
      total_ingresos DESC
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows;
};

// Consultas de ventas por sede

export const obtenerVentasPorSede = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      s.id_sede,
      s.nombre_sede,
      COALESCE(SUM(f.total_factura), 0) as total_ventas,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      sede s
    LEFT JOIN 
      factura f ON s.id_sede = f.id_sede_factura AND f.estado_factura = 'A'
      ${fechaInicio ? `AND f.fecha_factura >= $1` : ''}
      ${fechaFin ? `AND f.fecha_factura <= $2` : ''}
    WHERE 
      s.estado_sede = 'A'
    GROUP BY 
      s.id_sede, s.nombre_sede
    ORDER BY 
      total_ventas DESC
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows;
};

export const obtenerVentasPorSedePorMes = async (anio) => {
  const query = `
    SELECT 
      s.id_sede,
      s.nombre_sede,
      EXTRACT(MONTH FROM f.fecha_factura) as mes,
      COALESCE(SUM(f.total_factura), 0) as total_ventas,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      sede s
    LEFT JOIN 
      factura f ON s.id_sede = f.id_sede_factura AND f.estado_factura = 'A'
      AND EXTRACT(YEAR FROM f.fecha_factura) = $1
    WHERE 
      s.estado_sede = 'A'
    GROUP BY 
      s.id_sede, s.nombre_sede, EXTRACT(MONTH FROM f.fecha_factura)
    ORDER BY 
      s.nombre_sede, mes
  `;

  const result = await pool.query(query, [anio]);
  return result.rows;
};

export const obtenerVentasPorSedePorDia = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      s.id_sede,
      s.nombre_sede,
      f.fecha_factura as fecha,
      COALESCE(SUM(f.total_factura), 0) as total_ventas,
      COUNT(f.id_factura) as cantidad_facturas
    FROM 
      sede s
    LEFT JOIN 
      factura f ON s.id_sede = f.id_sede_factura AND f.estado_factura = 'A'
      ${fechaInicio ? `AND f.fecha_factura >= $1` : ''}
      ${fechaFin ? `AND f.fecha_factura <= $2` : ''}
    WHERE 
      s.estado_sede = 'A'
    GROUP BY 
      s.id_sede, s.nombre_sede, f.fecha_factura
    ORDER BY 
      s.nombre_sede, fecha
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows;
};

// Consultas para proveedores

export const obtenerPagosProveedoresTotales = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      p.id_proveedor,
      p.nombre_proveedor,
      COALESCE(SUM(fp.monto_facturaproveedor), 0) as total_pagos,
      COUNT(fp.id_facturaproveedor) as cantidad_facturas
    FROM 
      proveedor p
    LEFT JOIN 
      ordencompra oc ON p.id_proveedor = oc.id_proveedor_ordencompra AND oc.estado_facturaproveedor = 'A'
    LEFT JOIN 
      facturaproveedor fp ON oc.id_ordencompra = fp.id_ordencompra_facturaproveedor AND fp.estado_facturaproveedor = 'A'
      ${fechaInicio ? `AND fp.fecha_facturaproveedor >= $1` : ''}
      ${fechaFin ? `AND fp.fecha_facturaproveedor <= $2` : ''}
    WHERE 
      p.estado_proveedor = 'A'
    GROUP BY 
      p.id_proveedor, p.nombre_proveedor
    ORDER BY 
      total_pagos DESC
  `;

  const params = [];
  if (fechaInicio) params.push(fechaInicio);
  if (fechaFin) params.push(fechaFin);

  const result = await pool.query(query, params);
  return result.rows;
};

export const obtenerPagosProveedoresPorMes = async (anio) => {
  const query = `
    SELECT 
      EXTRACT(MONTH FROM fp.fecha_facturaproveedor) as mes,
      COALESCE(SUM(fp.monto_facturaproveedor), 0) as total_pagos,
      COUNT(fp.id_facturaproveedor) as cantidad_facturas
    FROM 
      facturaproveedor fp
    JOIN 
      ordencompra oc ON fp.id_ordencompra_facturaproveedor = oc.id_ordencompra
    WHERE 
      fp.estado_facturaproveedor = 'A'
      AND oc.estado_facturaproveedor = 'A'
      AND EXTRACT(YEAR FROM fp.fecha_facturaproveedor) = $1
    GROUP BY 
      mes
    ORDER BY 
      mes
  `;

  const result = await pool.query(query, [anio]);
  return result.rows;
};

// Consulta para nómina

export const obtenerNominaPorSedeYRol = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      s.id_sede,
      s.nombre_sede,
      e.cargo_empleado,
      COUNT(e.id_empleado) as cantidad_empleados,
      COALESCE(SUM(sa.monto_salario), 0) as total_nomina
    FROM 
      empleado e
    JOIN 
      sede s ON e.id_sede_empleado = s.id_sede
    LEFT JOIN 
      salario sa ON e.id_empleado = sa.id_empleado_salario AND sa.estado_salario = 'A'
    WHERE 
      e.estado_empleado = 'A'
      AND s.estado_sede = 'A'
    GROUP BY 
      s.id_sede, s.nombre_sede, e.cargo_empleado
    ORDER BY 
      s.nombre_sede, total_nomina DESC
  `;

  // Nota: fechaInicio y fechaFin no se utilizan aquí porque la tabla SALARIO no tiene campo de fecha
  // Para implementarlo correctamente, se necesitaría una tabla de histórico de salarios o pagos

  const result = await pool.query(query);
  return result.rows;
};
