import { pool } from "../../../db.js";

export const obtenerTiposDocumento = async () => {
  const result = await pool.query("SELECT * FROM TIPODOCUMENTO");
  return result.rows;
};
