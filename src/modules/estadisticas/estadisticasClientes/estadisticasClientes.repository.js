
import { pool } from "../../../db.js";  

/**
 * Obtiene la cantidad de clientes activos por día
 */
export const obtenerClientesActivosPorPeriodo = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      f.fecha_factura::date AS fecha,
      COUNT(DISTINCT f.id_cliente_factura) AS cantidad_clientes
    FROM factura f
    WHERE f.fecha_factura BETWEEN $1 AND $2
      AND f.estado_factura = 'A'
    GROUP BY f.fecha_factura::date
    ORDER BY fecha
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};

/**
 * Obtiene los mejores clientes por volumen de compra
 */
export const obtenerMejoresClientes = async (fechaInicio, fechaFin, limite = 10) => {
  const query = `
    WITH datos_clientes AS (
      SELECT 
        c.id_cliente,
        COALESCE(cn.nombre_cliente || ' ' || cn.apellido_cliente, cj.razonsocial_cliente) AS nombre_cliente,
        CASE 
          WHEN cn.id_cliente IS NOT NULL THEN 'Natural'
          WHEN cj.id_cliente IS NOT NULL THEN 'Jurídico'
          ELSE 'Desconocido'
        END AS tipo_cliente,
        SUM(f.total_factura) AS total_compras,
        COUNT(f.id_factura) AS cantidad_compras,
        AVG(f.total_factura) AS promedio_compra,
        MAX(f.fecha_factura) AS ultima_compra,
        MIN(f.fecha_factura) AS primera_compra
      FROM factura f
      JOIN cliente c ON f.id_cliente_factura = c.id_cliente
      LEFT JOIN clientenatural cn ON c.id_cliente = cn.id_cliente
      LEFT JOIN clientejuridico cj ON c.id_cliente = cj.id_cliente
      WHERE f.fecha_factura BETWEEN $1 AND $2
        AND f.estado_factura = 'A'
        AND c.estado_cliente = 'A'
      GROUP BY c.id_cliente, cn.nombre_cliente, cn.apellido_cliente, cj.razonsocial_cliente, 
               cn.id_cliente, cj.id_cliente
    )
    SELECT 
      id_cliente,
      nombre_cliente,
      tipo_cliente,
      total_compras,
      cantidad_compras,
      promedio_compra,
      ultima_compra,
      primera_compra,
      ROUND((total_compras * 100.0) / (SELECT SUM(total_compras) FROM datos_clientes), 2) AS porcentaje_ventas
    FROM datos_clientes
    ORDER BY total_compras DESC
    LIMIT $3
  `;
  
  const result = await pool.query(query, [fechaInicio, fechaFin, limite]);
  return result.rows;
};

export const obtenerClientesPorSede = async () => {
  try {
    const query = `
        SELECT 
            s.id_sede,
            s.nombre_sede,
            c.id_cliente,
            COALESCE(cn.nombre_cliente || ' ' || cn.apellido_cliente, cj.razonsocial_cliente) AS nombre_cliente,
            COUNT(DISTINCT f.id_factura) AS total_facturas,
            SUM(f.total_factura) AS total_ventas,
            AVG(f.total_factura) AS ticket_promedio
        FROM cliente c
        JOIN factura f ON c.id_cliente = f.id_cliente_factura
        JOIN sede s ON f.id_sede_factura = s.id_sede
        LEFT JOIN clientenatural cn ON c.id_cliente = cn.id_cliente
        LEFT JOIN clientejuridico cj ON c.id_cliente = cj.id_cliente
        WHERE f.estado_factura = 'A'
        GROUP BY s.id_sede, s.nombre_sede, c.id_cliente, cn.nombre_cliente, cn.apellido_cliente, cj.razonsocial_cliente
        ORDER BY total_ventas DESC;
    `;

    const result = await pool.query(query);
    return result.rows; // ✅ devuelve los datos sin usar res
  } catch (error) {
    console.error("Error en obtenerClientesPorSede:", error);
    throw error;
  }
};
