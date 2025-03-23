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

    // 🔍 Validaciones previas
    if (
      !ID_TIPOMOV_MOVIMIENTO ||
      !ID_PRODUCTO_MOVIMIENTO ||
      !CANTIDAD_MOVIMIENTO ||
      !ID_SEDE_MOVIMIENTO
    ) {
      return res.status(400).json({
        error:
          "Los campos ID_TIPOMOV_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, CANTIDAD_MOVIMIENTO y ID_SEDE_MOVIMIENTO son obligatorios",
      });
    }

    if (ID_SEDE_MOVIMIENTO === ID_SEDEDESTINO_MOVIMIENTO) {
      return res
        .status(400)
        .json({ error: "La sede origen y destino no pueden ser iguales" });
    }

    // 🔄 Verifica stock en la sede de origen
    const stockResult = await pool.query(
      "SELECT EXISTENCIA_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
      [ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
    );

    if (stockResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "El producto no existe en la sede origen" });
    }

    const stockDisponible = stockResult.rows[0].existencia_inventariolocal;
    if (CANTIDAD_MOVIMIENTO > stockDisponible) {
      return res
        .status(400)
        .json({ error: "Stock insuficiente en la sede origen" });
    }

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

    // 📦 Actualiza inventario en la sede origen
    await pool.query(
      "UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3",
      [CANTIDAD_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, ID_SEDE_MOVIMIENTO]
    );

    // 🏬 Si hay sede destino, actualiza su inventario sin usar ON CONFLICT
    if (ID_SEDEDESTINO_MOVIMIENTO) {
      const existeInventario = await pool.query(
        "SELECT 1 FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
        [ID_PRODUCTO_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO]
      );

      if (existeInventario.rowCount > 0) {
        // Si ya existe, actualiza el stock
        await pool.query(
          "UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL + $1 WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3",
          [
            CANTIDAD_MOVIMIENTO,
            ID_PRODUCTO_MOVIMIENTO,
            ID_SEDEDESTINO_MOVIMIENTO,
          ]
        );
      } else {
        // Si no existe, inserta un nuevo registro
        await pool.query(
          `INSERT INTO INVENTARIOLOCAL (
            ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL, STOCKMAXIMO_INVENTARIOLOCAL
          ) VALUES ($1, $2, $3, 
            COALESCE((SELECT STOCKMAXIMO_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 LIMIT 1), 0))
          ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
          DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + EXCLUDED.EXISTENCIA_INVENTARIOLOCAL;`,
          [
            ID_PRODUCTO_MOVIMIENTO,
            ID_SEDEDESTINO_MOVIMIENTO,
            CANTIDAD_MOVIMIENTO,
          ]
        );
      }
    }

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
