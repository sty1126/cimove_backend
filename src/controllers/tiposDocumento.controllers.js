import { pool } from "../db.js";

export const getTiposDocumento = async (req, res) => {
  const result = await pool.query("SELECT * FROM TIPODOCUMENTO");
  res.json(result.rows);
};
