import { pool } from "../db.js";

// Obtener todos los tipos de proveedores activos
export const getTiposProveedor = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_tipoproveedor, descripcion_tipoproveedor FROM TIPOPROVEEDOR WHERE estado_tipoproveedor = 'A'"
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
    const { descripcion_tipoproveedor } = req.body;

    if (!descripcion_tipoproveedor) {
      return res
        .status(400)
        .json({ error: "La descripción del tipo de proveedor es obligatoria" });
    }

    const result = await pool.query(
      "INSERT INTO TIPOPROVEEDOR (descripcion_tipoproveedor, estado_tipoproveedor) VALUES ($1, 'A') RETURNING *",
      [descripcion_tipoproveedor]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar tipo de proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
