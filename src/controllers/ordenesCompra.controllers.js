import { pool } from "../db.js";

// Obtener todas las órdenes de compra activas
export const getOrdenesCompra = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT oc.*, p.nombre_proveedor
      FROM ordencompra oc
      JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
      WHERE oc.estado_facturaproveedor = 'A' AND p.estado_proveedor = 'A'
      ORDER BY oc.fecha_ordencompra DESC
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener órdenes de compra:", error);
    res.status(500).json({ error: "Error al obtener órdenes de compra" });
  }
};

// Crear una nueva orden de compra
export const createOrdenCompra = async (req, res) => {
  try {
    const { id_proveedor, fecha, total } = req.body;
    const result = await pool.query(
      `INSERT INTO ordencompra (id_ordencompra, id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
       VALUES (DEFAULT, $1, $2, $3) RETURNING *`,
      [id_proveedor, fecha, total]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear orden de compra:", error);
    res.status(500).json({ error: "Error al crear orden de compra" });
  }
};

// Obtener una orden de compra por ID
export const getOrdenCompraById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT oc.*, p.nombre_proveedor
      FROM ordencompra oc
      JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
      WHERE oc.id_ordencompra = $1 AND oc.estado_facturaproveedor = 'A'
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Orden de compra no encontrada" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener orden de compra:", error);
    res.status(500).json({ error: "Error al obtener orden de compra" });
  }
};
