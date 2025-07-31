import { pool } from "../../../db.js";

export const obtenerTiposCliente = async () => {
  const result = await pool.query("SELECT * FROM TIPOCLIENTE");
  return result.rows;
};
