import { pool } from "../db.js";

// Obtener todo el inventario
export const getInventario = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventario");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el inventario" });
  }
};

// Obtener un registro de inventario
export const getInventarioById = async (req, res) => {
  const { inventarioId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventario WHERE id_inventario = $1",
      [inventarioId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el registro de inventario" });
  }
};

// Crear un nuevo registro de inventario
export const createInventario = async (req, res) => {
  const { id_producto_inventario, existencia_inventario, estado_inventario } =
    req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventario (id_producto_inventario, existencia_inventario, estado_inventario)
       VALUES ($1, $2, $3) RETURNING *`,
      [id_producto_inventario, existencia_inventario, estado_inventario || "A"]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el inventario" });
  }
};

// Actualizar un registro de inventario
export const updateInventario = async (req, res) => {
  const { inventarioId } = req.params;
  const nuevosDatos = req.body;

  try {
    // Obtener el registro actual
    const { rows } = await pool.query(
      "SELECT * FROM inventario WHERE id_inventario = $1",
      [inventarioId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: "Inventario no encontrado" });
    }
    const inventarioActual = rows[0];

    // Fusionar datos actuales con nuevos, priorizando los nuevos
    const datosActualizados = {
      id_producto_inventario:
        nuevosDatos.id_producto_inventario ||
        inventarioActual.id_producto_inventario,
      existencia_inventario:
        nuevosDatos.existencia_inventario ||
        inventarioActual.existencia_inventario,
      estado_inventario:
        nuevosDatos.estado_inventario || inventarioActual.estado_inventario,
    };

    // Ejecutar la actualización
    const result = await pool.query(
      `UPDATE inventario 
       SET id_producto_inventario = $1, existencia_inventario = $2, estado_inventario = $3
       WHERE id_inventario = $4 RETURNING *`,
      [
        datosActualizados.id_producto_inventario,
        datosActualizados.existencia_inventario,
        datosActualizados.estado_inventario,
        inventarioId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el inventario" });
  }
};
