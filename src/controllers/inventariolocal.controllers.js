import { pool } from "../db.js";

// Obtener todo el inventario local
export const getInventarioLocal = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventariolocal");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el inventario local" });
  }
};

// Obtener inventario local por sede
export const getInventarioLocalBySede = async (req, res) => {
  const { sedeId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventariolocal WHERE id_sede_inventariolocal = $1",
      [sedeId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay inventario en esta sede" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el inventario local por sede" });
  }
};

// Crear un nuevo registro de inventario local
export const createInventarioLocal = async (req, res) => {
  const {
    id_producto_inventariolocal,
    id_sede_inventariolocal,
    existencia_inventariolocal,
    stockminimo_inventariolocal,
    stockmaximo_inventariolocal,
    estado_inventariolocal,
  } = req.body;
  try {
    const result = await pool.query(
      `INSERT INTO inventariolocal (id_producto_inventariolocal, id_sede_inventariolocal, existencia_inventariolocal, 
      stockminimo_inventariolocal, stockmaximo_inventariolocal, estado_inventariolocal)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        id_producto_inventariolocal,
        id_sede_inventariolocal,
        existencia_inventariolocal,
        stockminimo_inventariolocal,
        stockmaximo_inventariolocal,
        estado_inventariolocal || "A",
      ]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el inventario local" });
  }
};

// Actualizar un registro de inventario local
export const updateInventarioLocal = async (req, res) => {
  const { inventarioLocalId } = req.params;
  const nuevosDatos = req.body;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventariolocal WHERE id_inventariolocal = $1",
      [inventarioLocalId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Inventario local no encontrado" });
    }
    const inventarioLocalActual = rows[0];
    const datosActualizados = {
      id_producto_inventariolocal:
        nuevosDatos.id_producto_inventariolocal ||
        inventarioLocalActual.id_producto_inventariolocal,
      id_sede_inventariolocal:
        nuevosDatos.id_sede_inventariolocal ||
        inventarioLocalActual.id_sede_inventariolocal,
      existencia_inventariolocal:
        nuevosDatos.existencia_inventariolocal ||
        inventarioLocalActual.existencia_inventariolocal,
      stockminimo_inventariolocal:
        nuevosDatos.stockminimo_inventariolocal ||
        inventarioLocalActual.stockminimo_inventariolocal,
      stockmaximo_inventariolocal:
        nuevosDatos.stockmaximo_inventariolocal ||
        inventarioLocalActual.stockmaximo_inventariolocal,
      estado_inventariolocal:
        nuevosDatos.estado_inventariolocal ||
        inventarioLocalActual.estado_inventariolocal,
    };
    const result = await pool.query(
      `UPDATE inventariolocal 
      SET id_producto_inventariolocal = $1, id_sede_inventariolocal = $2, existencia_inventariolocal = $3, 
      stockminimo_inventariolocal = $4, stockmaximo_inventariolocal = $5, estado_inventariolocal = $6
      WHERE id_inventariolocal = $7 RETURNING *`,
      [
        datosActualizados.id_producto_inventariolocal,
        datosActualizados.id_sede_inventariolocal,
        datosActualizados.existencia_inventariolocal,
        datosActualizados.stockminimo_inventariolocal,
        datosActualizados.stockmaximo_inventariolocal,
        datosActualizados.estado_inventariolocal,
        inventarioLocalId,
      ]
    );
    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar el inventario local" });
  }
};
