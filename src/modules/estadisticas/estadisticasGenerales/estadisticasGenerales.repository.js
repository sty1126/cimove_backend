import { pool } from "../../../db.js";  

// Beneficio neto en un rango de fechas (sin periodos)
export const obtenerRentabilidad = async (fechaInicio, fechaFin) => {
  const query = `
    WITH ingresos AS (
      SELECT 
        SUM(total_factura) AS ingreso_total
      FROM factura
      WHERE estado_factura = 'A'
        AND fecha_factura BETWEEN $1 AND $2
    ),
    egresos AS (
      SELECT 
        SUM(monto_facturaproveedor) AS egreso_total
      FROM facturaproveedor
      WHERE estado_facturaproveedor = 'A'
        AND fecha_facturaproveedor BETWEEN $1 AND $2
    )
    SELECT
      COALESCE(i.ingreso_total, 0) AS ingreso_total,
      COALESCE(e.egreso_total, 0) AS egreso_total,
      COALESCE(i.ingreso_total, 0) - COALESCE(e.egreso_total, 0) AS beneficio_neto
    FROM ingresos i, egresos e;
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows[0]; // solo una fila
};

// Evolución de rentabilidad (para gráficas)
export const obtenerEvolucionRentabilidad = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      f.fecha_factura::date AS fecha,
      SUM(df.cantvendida_detallefactura * df.precioventa_detallefactura) AS ingreso_total,
      SUM((df.precioventa_detallefactura - p.costoventa_producto) * df.cantvendida_detallefactura) AS beneficio_neto
    FROM detallefactura df
    JOIN factura f ON df.id_factura_detallefactura = f.id_factura
    JOIN producto p ON df.id_producto_detallefactura = p.id_producto
    WHERE f.fecha_factura BETWEEN $1 AND $2
      AND f.estado_factura = 'A'
      AND df.estado_detallefactura = 'A'
      AND p.estado_producto = 'A'
    GROUP BY f.fecha_factura::date
    ORDER BY fecha
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);

  const resultadosConMargen = result.rows.map(registro => {
    const margenPorcentaje = registro.ingreso_total > 0 
      ? (registro.beneficio_neto / registro.ingreso_total * 100).toFixed(2) 
      : 0;

    return {
      ...registro,
      margen_porcentaje: parseFloat(margenPorcentaje)
    };
  });

  return resultadosConMargen;
};


