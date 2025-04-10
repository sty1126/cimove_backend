import { pool } from "../db.js";

// 1. Obtener todos los abonos activos
export const getAbonos = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM abonofactura WHERE estado_abonofactura = 'A'`
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener abonos:", error);
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

// 2. Crear un nuevo abono
export const createAbono = async (req, res) => {
  try {
    const {
      id_facturaproveedor_abonofactura,
      fecha_abonofactura,
      monto_abonofactura,
    } = req.body;

    if (
      !id_facturaproveedor_abonofactura ||
      !fecha_abonofactura ||
      !monto_abonofactura
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    const result = await pool.query(
      `INSERT INTO abonofactura (id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura, estado_abonofactura)
       VALUES ($1, $2, $3, 'A') RETURNING *`,
      [id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear abono:", error);
    res.status(500).json({ error: "Error al crear abono" });
  }
};

// 3. Obtener abonos por ID de factura
export const getAbonosPorFactura = async (req, res) => {
  try {
    const { idFactura } = req.params;

    const result = await pool.query(
      `SELECT * FROM abonofactura 
       WHERE id_facturaproveedor_abonofactura = $1 
       AND estado_abonofactura = 'A'`,
      [idFactura]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener abonos por factura:", error);
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

// 4. Anular abono (cambiar estado a 'I')
export const anularAbono = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `UPDATE abonofactura SET estado_abonofactura = 'I' WHERE id_abonofactura = $1 RETURNING *`,
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Abono no encontrado" });
    }

    res.json({ mensaje: "Abono anulado correctamente", abono: result.rows[0] });
  } catch (error) {
    console.error("Error al anular abono:", error);
    res.status(500).json({ error: "Error al anular abono" });
  }
};

export const getTotalAbonadoPorFactura = async (req, res) => {
  try {
    const { idFactura } = req.params;

    const result = await pool.query(
      `SELECT COALESCE(SUM(monto_abonofactura), 0) AS total_abonado
         FROM abonofactura
         WHERE id_facturaproveedor_abonofactura = $1 AND estado_abonofactura = 'A'`,
      [idFactura]
    );

    res.json({ idFactura, totalAbonado: result.rows[0].total_abonado });
  } catch (error) {
    console.error("Error al calcular total abonado:", error);
    res.status(500).json({ error: "Error al calcular el total abonado" });
  }
};
