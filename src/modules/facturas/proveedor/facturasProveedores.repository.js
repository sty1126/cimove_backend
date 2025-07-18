import { pool } from "../../../db.js";

export const findAll = async () => {
  const res = await pool.query("SELECT * FROM FACTURAPROVEEDOR WHERE ESTADO_FACTURAPROVEEDOR = 'A'");
  return res.rows;
};

export const findById = async (id) => {
  const res = await pool.query("SELECT * FROM FACTURAPROVEEDOR WHERE ID_FACTURAPROVEEDOR = $1", [id]);
  return res.rows[0] || null;
};

export const insert = async ({ idOrdenCompra, fecha, monto }) => {
  const res = await pool.query(
    `INSERT INTO FACTURAPROVEEDOR (
      ID_ORDENCOMPRA_FACTURAPROVEEDOR,
      FECHA_FACTURAPROVEEDOR,
      MONTO_FACTURAPROVEEDOR,
      ESTADO_FACTURAPROVEEDOR
    ) VALUES ($1, $2, $3, 'A') RETURNING *`,
    [idOrdenCompra, fecha, monto]
  );
  return res.rows[0];
};
