import { pool } from "../db.js";

export const getTiposUsuario = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM TIPOUSUARIO WHERE ESTADO_TIPOUSUARIO = 'A'"
  );
  res.json(result.rows);
};
