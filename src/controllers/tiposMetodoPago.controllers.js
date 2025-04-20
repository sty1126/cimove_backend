import { pool } from "../db.js";

// Obtener todos los tipos de método de pago activos
export const getTiposMetodoPago = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM TIPOMETODOPAGO WHERE ESTADO_TIPOMETODOPAGO = 'A' ORDER BY ID_TIPOMETODOPAGO DESC"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos de método de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al obtener tipos de método de pago", error });
  }
};

// Crear un nuevo tipo de método de pago
export const crearTipoMetodoPago = async (req, res) => {
  const { nombre, comision, recepcion } = req.body;

  try {
    await pool.query(
      `INSERT INTO TIPOMETODOPAGO (NOMBRE_TIPOMETODOPAGO, COMISION_TIPOMETODOPAGO, RECEPCION_TIPOMETODOPAGO)
       VALUES ($1, $2, $3)`,
      [nombre, comision, recepcion]
    );
    res
      .status(201)
      .json({ mensaje: "Tipo de método de pago creado con éxito" });
  } catch (error) {
    console.error("Error al crear tipo de método de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al crear tipo de método de pago", error });
  }
};

// Actualizar un tipo de método de pago
export const actualizarTipoMetodoPago = async (req, res) => {
  const { id } = req.params;
  const { nombre, comision, recepcion } = req.body;

  try {
    await pool.query(
      `UPDATE TIPOMETODOPAGO 
       SET NOMBRE_TIPOMETODOPAGO = $1,
           COMISION_TIPOMETODOPAGO = $2,
           RECEPCION_TIPOMETODOPAGO = $3
       WHERE ID_TIPOMETODOPAGO = $4`,
      [nombre, comision, recepcion, id]
    );
    res.json({ mensaje: "Tipo de método de pago actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar tipo de método de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al actualizar tipo de método de pago", error });
  }
};

// Eliminar (inhabilitar) un tipo de método de pago
export const eliminarTipoMetodoPago = async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `UPDATE TIPOMETODOPAGO SET ESTADO_TIPOMETODOPAGO = 'I' WHERE ID_TIPOMETODOPAGO = $1`,
      [id]
    );
    res.json({ mensaje: "Tipo de método de pago eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar tipo de método de pago:", error);
    res
      .status(500)
      .json({ mensaje: "Error al eliminar tipo de método de pago", error });
  }
};
