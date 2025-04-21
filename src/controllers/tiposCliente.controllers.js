import { pool } from "../db.js";

export const getTiposCliente = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM TIPOCLIENTE");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos de cliente:", error);
    res.status(500).json({ error: "Error al obtener tipos de cliente" });
  }
};
