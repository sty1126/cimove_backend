import { pool } from "../../db.js"; 

export const insertMetodoPago = async (idFactura, idTipoMetodoPago, monto) => {
  const result = await pool.query(
    `INSERT INTO METODOPAGO (
      ID_TIPOMETODOPAGO_METODOPAGO,
      ID_FACTURA_METODOPAGO,
      MONTO_METODOPAGO,
      ESTADO_METODOPAGO
    ) VALUES ($1, $2, $3, 'A')
    RETURNING *`,
    [idTipoMetodoPago, idFactura, monto]
  );
  return result.rows[0];
};

export const fetchMetodosPagoByFacturaId = async (idFactura) => {
  const result = await pool.query(
    `SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
     FROM METODOPAGO mp
     JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
     WHERE mp.ID_FACTURA_METODOPAGO = $1 AND mp.ESTADO_METODOPAGO = 'A'`,
    [idFactura]
  );
  return result.rows;
};

export const fetchAllActiveMetodosPago = async () => {
  const result = await pool.query(`
    SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
    FROM METODOPAGO mp
    JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
    WHERE mp.ESTADO_METODOPAGO = 'A'
    ORDER BY mp.ID_METODOPAGO DESC
  `);
  return result.rows;
};

export const deactivateMetodoPagoById = async (idMetodoPago) => {
  const result = await pool.query(
    `UPDATE METODOPAGO
     SET ESTADO_METODOPAGO = 'I'
     WHERE ID_METODOPAGO = $1
     RETURNING *`, 
    [idMetodoPago]
  );
  return result.rows[0]; 
};