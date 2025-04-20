import { pool } from "../db.js";

// Agregar métodos de pago a una factura (pueden ser varios)
export const agregarMetodosPago = async (req, res) => {
  const { idFactura } = req.params;
  const { metodosPago } = req.body;

  try {
    for (const pago of metodosPago) {
      await pool.query(
        `
        INSERT INTO METODOPAGO (
          ID_TIPOMETODOPAGO_METODOPAGO,
          ID_FACTURA_METODOPAGO,
          MONTO_METODOPAGO
        ) VALUES ($1, $2, $3)
      `,
        [pago.idTipoMetodoPago, idFactura, pago.monto]
      );
    }

    res.status(201).json({ mensaje: "Métodos de pago agregados con éxito" });
  } catch (error) {
    console.error("Error al agregar métodos de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al agregar métodos de pago", error });
  }
};

// Obtener métodos de pago por ID de factura
export const obtenerMetodosPagoPorFactura = async (req, res) => {
  const { idFactura } = req.params;

  try {
    const result = await pool.query(
      `
      SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
      FROM METODOPAGO mp
      JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
      WHERE mp.ID_FACTURA_METODOPAGO = $1 AND mp.ESTADO_METODOPAGO = 'A'
    `,
      [idFactura]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener métodos de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener métodos de pago", error });
  }
};

// Obtener todos los métodos de pago activos
export const obtenerTodosLosMetodosPago = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
      FROM METODOPAGO mp
      JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
      WHERE mp.ESTADO_METODOPAGO = 'A'
      ORDER BY mp.ID_METODOPAGO DESC
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener métodos de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener métodos de pago", error });
  }
};

// Anular un método de pago
export const anularMetodoPago = async (req, res) => {
  const { idMetodoPago } = req.params;

  try {
    await pool.query(
      `
      UPDATE METODOPAGO
      SET ESTADO_METODOPAGO = 'I'
      WHERE ID_METODOPAGO = $1
    `,
      [idMetodoPago]
    );

    res.json({ mensaje: "Método de pago anulado con éxito" });
  } catch (error) {
    console.error("Error al anular método de pago:", error);
    res.status(500).json({ mensaje: "Error al anular método de pago", error });
  }
};
