import { pool } from "../../../db.js";

export const obtenerTiposProveedor = async () => {
  const result = await pool.query(`
    SELECT id_tipoproveedor, nombre_tipoproveedor
    FROM TIPOPROVEEDOR
    WHERE estado_tipoproveedor = 'A'
  `);
  return result.rows;
};

export const insertarTipoProveedor = async (nombre) => {
  const result = await pool.query(`
    INSERT INTO TIPOPROVEEDOR (nombre_tipoproveedor, estado_tipoproveedor)
    VALUES ($1, 'A')
    RETURNING *
  `, [nombre]);

  return result.rows[0];
};
