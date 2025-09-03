import { pool } from "../../../db.js";  

/**
 * Obtiene estadísticas de ventas por día de la semana
 * @param {Date} fechaInicio - Fecha de inicio para el filtro
 * @param {Date} fechaFin - Fecha de fin para el filtro
 */
export const obtenerVentasPorDiaSemana = async (fechaInicio, fechaFin) => {
  const query = `
    WITH ventas_diarias AS (
      SELECT 
        fecha_factura,
        EXTRACT(DOW FROM fecha_factura) AS dia_semana,
        COUNT(id_factura) AS cantidad_facturas,
        SUM(total_factura) AS total_ventas
      FROM factura
      WHERE fecha_factura BETWEEN $1 AND $2
        AND estado_factura = 'A'
      GROUP BY fecha_factura, EXTRACT(DOW FROM fecha_factura)
    ),
    resumen_dias AS (
      SELECT 
        dia_semana,
        COUNT(fecha_factura) AS dias_con_ventas,
        SUM(cantidad_facturas) AS cantidad_facturas,
        SUM(total_ventas) AS total_ventas,
        AVG(total_ventas) AS promedio_ventas_diarias
      FROM ventas_diarias
      GROUP BY dia_semana
    )
    SELECT 
      dia_semana,
      CASE dia_semana
        WHEN 0 THEN 'Domingo'
        WHEN 1 THEN 'Lunes'
        WHEN 2 THEN 'Martes'
        WHEN 3 THEN 'Miércoles'
        WHEN 4 THEN 'Jueves'
        WHEN 5 THEN 'Viernes'
        WHEN 6 THEN 'Sábado'
      END AS nombre_dia,
      dias_con_ventas,
      cantidad_facturas,
      total_ventas,
      ROUND(promedio_ventas_diarias, 2) AS promedio_ventas_diarias,
      ROUND((total_ventas * 100.0) / (SELECT SUM(total_ventas) FROM resumen_dias), 2) AS porcentaje_ventas
    FROM resumen_dias
    ORDER BY dia_semana
  `;
  
  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};

/**
 * Obtiene datos para un mapa de calor por día de la semana
 * @param {Date} fechaInicio - Fecha de inicio para el filtro
 * @param {Date} fechaFin - Fecha de fin para el filtro
 */
export const obtenerMapaCalorVentas = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      EXTRACT(DOW FROM fecha_factura) AS dia_semana,
      SUM(total_factura) AS valor
    FROM factura
    WHERE fecha_factura BETWEEN $1 AND $2
      AND estado_factura = 'A'
    GROUP BY dia_semana
    ORDER BY dia_semana
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};

// Ingresos por categoría
export const obtenerIngresosPorCategoria = async (fechaInicio, fechaFin, limite = 10) => {
  const query = `
    SELECT 
      c.id_categoria,
      c.descripcion_categoria AS categoria,
      SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) AS ingreso_total,
      ROUND((SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) * 100.0) / 
        (SELECT SUM(cantvendida_detallefactura * precioventa_detallefactura) 
         FROM detallefactura df2 
         JOIN factura f2 ON df2.id_factura_detallefactura = f2.id_factura 
         WHERE f2.fecha_factura BETWEEN $1 AND $2 AND f2.estado_factura = 'A'
        ), 2) AS porcentaje
    FROM detallefactura df
    JOIN factura f ON df.id_factura_detallefactura = f.id_factura
    JOIN producto p ON df.id_producto_detallefactura = p.id_producto
    JOIN categoria c ON p.id_categoria_producto = c.id_categoria
    WHERE f.fecha_factura BETWEEN $1 AND $2
      AND f.estado_factura = 'A'
    GROUP BY c.id_categoria, c.descripcion_categoria
    ORDER BY ingreso_total DESC
    LIMIT $3
  `;
  
  const result = await pool.query(query, [fechaInicio, fechaFin, limite]);
  return result.rows;
};

// Ingresos totales en un rango de fechas (sin tipos de periodo)
export const obtenerIngresosPorPeriodo = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      DATE(f.fecha_factura) AS fecha,
      COALESCE(SUM(f.total_factura), 0) AS ingreso_total
    FROM factura f
    WHERE f.estado_factura = 'A'
      AND f.fecha_factura BETWEEN $1 AND $2
    GROUP BY DATE(f.fecha_factura)
    ORDER BY fecha
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};

// 📂 estadisticasIngresos.repository.js
export const obtenerVentasPorSede = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      DATE(f.fecha_factura) AS fecha,
      s.id_sede,
      s.nombre_sede,
      COUNT(DISTINCT f.id_factura) AS cantidad_facturas,
      SUM(f.total_factura) AS total_ventas,
      AVG(f.total_factura) AS ticket_promedio,
      COUNT(DISTINCT f.id_cliente_factura) AS clientes_unicos
    FROM factura f
    JOIN sede s ON f.id_sede_factura = s.id_sede
    WHERE f.estado_factura = 'A'
      AND f.fecha_factura BETWEEN $1 AND $2
    GROUP BY DATE(f.fecha_factura), s.id_sede, s.nombre_sede
    ORDER BY fecha, s.id_sede
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows; // ✅ solo retorna los datos
};

// En tu controlador de estadísticas
export const obtenerIngresosPorMetodoPago = async (fechaInicio, fechaFin) => {
    const query = `
      SELECT 
        tmp.id_tipometodopago,
        tmp.nombre_tipometodopago,
        COUNT(mp.id_metodopago) AS cantidad_transacciones,
        SUM(mp.monto_metodopago) AS total_ingresos,
        AVG(mp.monto_metodopago) AS promedio_ingreso
      FROM 
        metodopago mp
      JOIN 
        tipometodopago tmp ON mp.id_tipometodopago_metodopago = tmp.id_tipometodopago
      JOIN 
        factura f ON mp.id_factura_metodopago = f.id_factura
      WHERE 
        mp.estado_metodopago = 'A' AND
        f.estado_factura = 'A' AND
        f.fecha_factura BETWEEN $1 AND $2
      GROUP BY 
        tmp.id_tipometodopago, tmp.nombre_tipometodopago
      ORDER BY 
        total_ingresos DESC
    `;

    const result = await pool.query(query, [fechaInicio, fechaFin]);
    return result.rows; // ✅ solo retorna los datos
};

// En tu controlador de estadísticas
export const obtenerIngresosPorMetodoPagoYSede = async (fechaInicio, fechaFin) => {
    const query = `
      SELECT 
        s.id_sede,
        s.nombre_sede,
        tmp.id_tipometodopago,
        tmp.nombre_tipometodopago,
        COUNT(mp.id_metodopago) AS cantidad_transacciones,
        SUM(mp.monto_metodopago) AS total_ingresos,
        AVG(mp.monto_metodopago) AS promedio_ingreso
      FROM metodopago mp
      JOIN tipometodopago tmp 
        ON mp.id_tipometodopago_metodopago = tmp.id_tipometodopago
      JOIN factura f 
        ON mp.id_factura_metodopago = f.id_factura
      JOIN sede s 
        ON f.id_sede_factura = s.id_sede
      WHERE mp.estado_metodopago = 'A'
        AND f.estado_factura = 'A'
        AND f.fecha_factura BETWEEN $1 AND $2
      GROUP BY 
        s.id_sede, s.nombre_sede, tmp.id_tipometodopago, tmp.nombre_tipometodopago
      ORDER BY 
        s.id_sede, total_ingresos DESC
    `;

    const result = await pool.query(query, [fechaInicio, fechaFin]);
    return result.rows; // ✅ solo retorna los datos
};
