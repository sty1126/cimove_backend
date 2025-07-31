import { pool } from "../../../db.js";

export const obtenerTiposMetodoPago = async () => {
  const result = await pool.query(`
    SELECT * FROM TIPOMETODOPAGO 
    WHERE ESTADO_TIPOMETODOPAGO = 'A'
    ORDER BY ID_TIPOMETODOPAGO DESC
  `);
  return result.rows;
};

export const insertarTipoMetodoPago = async (nombre, comision, recepcion) => {
  await pool.query(`
    INSERT INTO TIPOMETODOPAGO (
      NOMBRE_TIPOMETODOPAGO, 
      COMISION_TIPOMETODOPAGO, 
      RECEPCION_TIPOMETODOPAGO
    ) VALUES ($1, $2, $3)
  `, [nombre, comision, recepcion]);
};

export const actualizarTipoMetodoPago = async (id, nombre, comision, recepcion) => {
  await pool.query(`
    UPDATE TIPOMETODOPAGO SET 
      NOMBRE_TIPOMETODOPAGO = $1,
      COMISION_TIPOMETODOPAGO = $2,
      RECEPCION_TIPOMETODOPAGO = $3
    WHERE ID_TIPOMETODOPAGO = $4
  `, [nombre, comision, recepcion, id]);
};

export const inhabilitarTipoMetodoPago = async (id) => {
  await pool.query(`
    UPDATE TIPOMETODOPAGO 
    SET ESTADO_TIPOMETODOPAGO = 'I'
    WHERE ID_TIPOMETODOPAGO = $1
  `, [id]);
};
