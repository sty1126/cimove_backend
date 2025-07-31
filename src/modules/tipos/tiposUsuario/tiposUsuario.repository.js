import { pool } from "../../../db.js"

export const fetchActiveTiposUsuario = async () => {
  const result = await pool.query(
    "SELECT * FROM TIPOUSUARIO WHERE ESTADO_TIPOUSUARIO = 'A'"
  );
  return result.rows;
};