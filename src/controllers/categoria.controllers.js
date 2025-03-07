import { pool } from "../db.js";

// Obtener todas las categorías activas
export const getCategorias = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_categoria, descripcion_categoria FROM CATEGORIA WHERE estado_categoria = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener categorías:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar una nueva categoría
export const createCategoria = async (req, res) => {
  try {
    const { descripcion_categoria } = req.body;

    if (!descripcion_categoria) {
      return res
        .status(400)
        .json({ error: "La descripción de la categoría es obligatoria" });
    }

    const result = await pool.query(
      "INSERT INTO CATEGORIA (descripcion_categoria, estado_categoria) VALUES ($1, 'A') RETURNING *",
      [descripcion_categoria]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar categoría:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
