import { pool } from "../db.js";

export const getFacturasProveedor = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          f.id_facturaproveedor, 
          f.fecha_facturaproveedor, 
          f.monto_facturaproveedor,
          COALESCE(SUM(a.monto_abonofactura), 0) AS total_abonado,
          f.monto_facturaproveedor - COALESCE(SUM(a.monto_abonofactura), 0) AS saldo_pendiente,
          p.nombre_proveedor,
          f.estado_facturaproveedor
        FROM facturaproveedor f
        JOIN ordencompra oc ON f.id_ordencompra_facturaproveedor = oc.id_ordencompra
        JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
        LEFT JOIN abonofactura a ON a.id_facturaproveedor_abonofactura = f.id_facturaproveedor
        WHERE f.estado_facturaproveedor = 'A'
        GROUP BY f.id_facturaproveedor, f.fecha_facturaproveedor, f.monto_facturaproveedor, p.nombre_proveedor
      `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    res.status(500).json({ error: "Error al obtener las facturas" });
  }
};

// Crear factura
export const createFacturaProveedor = async (req, res) => {
  const { id_ordencompra, fecha, monto } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO facturaproveedor (id_ordencompra_facturaproveedor, fecha_facturaproveedor, monto_facturaproveedor)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [id_ordencompra, fecha, monto]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la factura del proveedor" });
  }
};
