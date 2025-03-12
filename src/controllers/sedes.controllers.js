import { pool } from "../db.js";

// Obtener todas las sedes activas
export const getSedes = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id_sede, nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede FROM SEDE WHERE estado_sede = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar una nueva sede
export const createSede = async (req, res) => {
  try {
    const {
      nombre_sede,
      id_ciudad_sede,
      direccion_sede,
      numeroempleados_sede,
      telefono_sede,
    } = req.body;

    if (
      !nombre_sede ||
      !id_ciudad_sede ||
      !direccion_sede ||
      !numeroempleados_sede
    ) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben ser proporcionados",
      });
    }

    const result = await pool.query(
      "INSERT INTO SEDE (nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede, estado_sede) VALUES ($1, $2, $3, $4, $5, 'A') RETURNING *",
      [
        nombre_sede,
        id_ciudad_sede,
        direccion_sede,
        numeroempleados_sede,
        telefono_sede,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar sede:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Desactivar una sede
export const deactivateSede = async (req, res) => {
  try {
    const { id_sede } = req.params;
    const result = await pool.query(
      "UPDATE SEDE SET estado_sede = 'I' WHERE id_sede = $1 RETURNING *",
      [id_sede]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Sede no encontrada" });
    }

    res.json({ message: "Sede desactivada correctamente" });
  } catch (error) {
    console.error("Error al desactivar sede:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
