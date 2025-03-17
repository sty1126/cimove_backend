import { pool } from "../db.js";

// Obtener todos los movimientos de productos
export const getMovimientos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM MOVPRODUCTO");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getTipoMovimientos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Agregar un nuevo movimiento de producto
export const createMovimiento = async (req, res) => {
  try {
    const {
      id_tipomov,
      id_producto,
      cantidad_mov,
      fecha_movimiento,
      estado_movimiento,
    } = req.body;

    if (
      !id_tipomov ||
      !id_producto ||
      !cantidad_mov ||
      !fecha_movimiento ||
      !estado_movimiento
    ) {
      return res
        .status(400)
        .json({ error: "Todos los campos son obligatorios" });
    }

    // Insertar el nuevo movimiento de producto
    const result = await pool.query(
      "INSERT INTO MOVPRODUCTO (ID_TIPOMOV, ID_PRODUCTO, CANTIDAD_MOV, FECHA_MOVIMIENTO, ESTADO_MOVIMIENTO) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [
        id_tipomov,
        id_producto,
        cantidad_mov,
        fecha_movimiento,
        estado_movimiento,
      ]
    );

    // Devolver el movimiento creado recientemente
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar movimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
