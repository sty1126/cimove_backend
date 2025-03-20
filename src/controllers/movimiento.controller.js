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

export const createMovimiento = async (req, res) => {
  try {
    const {
      ID_TIPOMOV_MOVIMIENTO,
      ID_PRODUCTO_MOVIMIENTO,
      CANTIDAD_MOVIMIENTO,
      ID_SEDE_MOVIMIENTO,
      ID_SEDEDESTINO_MOVIMIENTO = null,
      ID_CLIENTE_MOVIMIENTO = null,
      ID_PROVEEDOR_MOVIMIENTO = null,
      FECHA_MOVIMIENTO = new Date().toISOString().split("T")[0],
      ESTADO_MOVIMIENTO = "A",
    } = req.body;

    // 🔥 Inserta el movimiento en la base de datos
    const result = await pool.query(
      `INSERT INTO MOVPRODUCTO (
        ID_TIPOMOV_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, CANTIDAD_MOVIMIENTO, 
        FECHA_MOVIMIENTO, ESTADO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO, 
        ID_CLIENTE_MOVIMIENTO, ID_PROVEEDOR_MOVIMIENTO
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        ID_TIPOMOV_MOVIMIENTO,
        ID_PRODUCTO_MOVIMIENTO,
        CANTIDAD_MOVIMIENTO,
        FECHA_MOVIMIENTO,
        ESTADO_MOVIMIENTO,
        ID_SEDE_MOVIMIENTO,
        ID_SEDEDESTINO_MOVIMIENTO,
        ID_CLIENTE_MOVIMIENTO,
        ID_PROVEEDOR_MOVIMIENTO,
      ]
    );

    res.status(201).json({
      message: "Movimiento registrado con éxito",
      movimiento: result.rows[0],
    });
  } catch (error) {
    console.error("❌ Error al agregar movimiento:", error);
    res
      .status(500)
      .json({ error: "Error interno del servidor", detalle: error.message });
  }
};
