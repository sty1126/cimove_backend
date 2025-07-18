import { pool } from "../../db.js";

export const obtenerAbonosActivos = async () => {
  const result = await pool.query(`SELECT * FROM abonofactura WHERE estado_abonofactura = 'A'`);
  return result.rows;
};

export const insertarAbono = async (idFactura, fecha, monto) => {
  const result = await pool.query(
    `INSERT INTO abonofactura (id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura, estado_abonofactura)
     VALUES ($1, $2, $3, 'A') RETURNING *`,
    [idFactura, fecha, monto]
  );
  return result.rows[0];
};

export const obtenerAbonosPorFactura = async (idFactura) => {
  const result = await pool.query(
    `SELECT * FROM abonofactura 
     WHERE id_facturaproveedor_abonofactura = $1 
     AND estado_abonofactura = 'A'`,
    [idFactura]
  );
  return result.rows;
};

export const anularAbonoPorId = async (id) => {
  const result = await pool.query(
    `UPDATE abonofactura SET estado_abonofactura = 'I' WHERE id_abonofactura = $1 RETURNING *`,
    [id]
  );
  return result.rowCount > 0 ? result.rows[0] : null;
};

export const calcularTotalAbonado = async (idFactura) => {
  const result = await pool.query(
    `SELECT COALESCE(SUM(monto_abonofactura), 0) AS total_abonado
     FROM abonofactura
     WHERE id_facturaproveedor_abonofactura = $1 AND estado_abonofactura = 'A'`,
    [idFactura]
  );
  return { idFactura, totalAbonado: result.rows[0].total_abonado };
};