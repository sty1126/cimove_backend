import { pool } from "../db.js";


export const getCiudades = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_ciudad, nombre_ciudad FROM ciudad WHERE estado_ciudad = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ciudades" });
  }
};



export const createCiudad = async (req, res) => {
  try {
    const { nombre_ciudad } = req.body;
    if (!nombre_ciudad) {
      return res.status(400).json({ error: "El nombre de la ciudad es requerido" });
    }

    // Para PostgreSQL usamos RETURNING para obtener el registro insertado
    const result = await pool.query(
      "INSERT INTO CIUDAD (ID_CIUDAD, NOMBRE_CIUDAD, ESTADO_CIUDAD) VALUES (gen_random_uuid(), $1, 'A') RETURNING *",
      [nombre_ciudad]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear ciudad:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}; 
