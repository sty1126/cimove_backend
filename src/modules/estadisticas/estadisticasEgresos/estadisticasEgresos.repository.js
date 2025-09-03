import { pool } from "../../../db.js";  

// Egresos totales por día
export const obtenerEgresosPorPeriodo = async (fechaInicio, fechaFin) => {
  const query = `
    SELECT 
      fecha_facturaproveedor::date AS fecha,
      COALESCE(SUM(monto_facturaproveedor), 0) AS egreso_total
    FROM facturaproveedor
    WHERE estado_facturaproveedor = 'A'
      AND fecha_facturaproveedor BETWEEN $1 AND $2
    GROUP BY fecha_facturaproveedor::date
    ORDER BY fecha
  `;

  const result = await pool.query(query, [fechaInicio, fechaFin]);
  return result.rows;
};


// Principales egresos (por proveedor)
export const obtenerPrincipalesEgresos = async (fechaInicio, fechaFin, limite = 10) => {
  const query = `
    SELECT 
      p.id_proveedor,
      p.nombre_proveedor,
      SUM(fp.monto_facturaproveedor) AS egreso_total
    FROM facturaproveedor fp
    JOIN ordencompra oc ON fp.id_ordencompra_facturaproveedor = oc.id_ordencompra
    JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
    WHERE fp.fecha_facturaproveedor BETWEEN $1 AND $2
      AND fp.estado_facturaproveedor = 'A'
    GROUP BY p.id_proveedor, p.nombre_proveedor
    ORDER BY egreso_total DESC
    LIMIT $3
  `;
  
  const result = await pool.query(query, [fechaInicio, fechaFin, limite]);
  return result.rows;
};

