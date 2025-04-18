import { pool } from "../db.js";

// Obtener todos los tipos de proveedores activos
export const getTiposProveedor = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_tipoproveedor, nombre_tipoproveedor FROM TIPOPROVEEDOR WHERE estado_tipoproveedor = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos de proveedores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar un nuevo tipo de proveedor
export const createTipoProveedor = async (req, res) => {
  try {
    const { nombre_tipoproveedor } = req.body;

    if (!nombre_tipoproveedor) {
      return res
        .status(400)
        .json({ error: "El nombre del tipo de proveedor es obligatorio" });
    }

    const result = await pool.query(
      "INSERT INTO TIPOPROVEEDOR (nombre_tipoproveedor, estado_tipoproveedor) VALUES ($1, 'A') RETURNING *",
      [nombre_tipoproveedor]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar tipo de proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
