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
      id_tipomov,
      id_producto,
      cantidad_mov,
      id_sede_origen,
      id_sede_destino = null, // Opcionales, si no se envían, serán null
      id_cliente = null,
      id_proveedor = null,
      fecha_movimiento = new Date(), // Si no se envía, se usa la fecha actual
      estado_movimiento = "A", // Si no se envía, se usa "A" por defecto
    } = req.body;

    // Solo validamos los campos que son NOT NULL
    if (!id_tipomov || !id_producto || !cantidad_mov || !id_sede_origen) {
      return res.status(400).json({
        error:
          "Los campos id_tipomov, id_producto, cantidad_mov y id_sede_origen son obligatorios",
      });
    }

    // Evita que la sede de origen y destino sean iguales
    if (id_sede_origen === id_sede_destino) {
      return res.status(400).json({
        error: "La sede origen y la sede destino no pueden ser iguales",
      });
    }

    // Verifica si hay suficiente stock en la sede origen
    const stockResult = await pool.query(
      "SELECT EXISTENCIA_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
      [id_producto, id_sede_origen]
    );

    if (stockResult.rows.length === 0) {
      return res
        .status(400)
        .json({ error: "El producto no existe en la sede origen" });
    }

    const stockDisponible = stockResult.rows[0].existencia_inventariolocal;

    if (cantidad_mov > stockDisponible) {
      return res
        .status(400)
        .json({ error: "Stock insuficiente en la sede origen" });
    }

    // Inserta el nuevo movimiento de producto
    const result = await pool.query(
      `INSERT INTO MOVPRODUCTO (
        ID_TIPOMOV_MOVIMIENTO, ID_PRODUCTO_MOVIMIENTO, CANTIDAD_MOVIMIENTO, 
        FECHA_MOVIMIENTO, ESTADO_MOVIMIENTO, ID_SEDE_MOVIMIENTO, ID_SEDEDESTINO_MOVIMIENTO, 
        ID_CLIENTE_MOVIMIENTO, ID_PROVEEDOR_MOVIMIENTO
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [
        id_tipomov,
        id_producto,
        cantidad_mov,
        fecha_movimiento,
        estado_movimiento,
        id_sede_origen,
        id_sede_destino,
        id_cliente,
        id_proveedor,
      ]
    );

    // Actualiza el inventario de la sede origen
    await pool.query(
      "UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL - $1 WHERE ID_PRODUCTO_INVENTARIOLOCAL = $2 AND ID_SEDE_INVENTARIOLOCAL = $3",
      [cantidad_mov, id_producto, id_sede_origen]
    );

    // Si hay sede destino, actualiza su inventario
    if (id_sede_destino) {
      await pool.query(
        `INSERT INTO INVENTARIOLOCAL (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL, EXISTENCIA_INVENTARIOLOCAL)
        VALUES ($1, $2, $3)
        ON CONFLICT (ID_PRODUCTO_INVENTARIOLOCAL, ID_SEDE_INVENTARIOLOCAL)
        DO UPDATE SET EXISTENCIA_INVENTARIOLOCAL = INVENTARIOLOCAL.EXISTENCIA_INVENTARIOLOCAL + $3`,
        [id_producto, id_sede_destino, cantidad_mov]
      );
    }

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al agregar movimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
