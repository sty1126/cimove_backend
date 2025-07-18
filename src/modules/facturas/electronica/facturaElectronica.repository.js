import { pool } from "../../../db.js";

export const findAllActivas = async () => {
  const res = await pool.query("SELECT * FROM FACTURACIONELECTRONICA WHERE ESTADO_FACTURAELECTRONICA = 'A'");
  return res.rows;
};

export const findById = async (id) => {
  const res = await pool.query("SELECT * FROM FACTURACIONELECTRONICA WHERE ID_FACTURA = $1 AND ESTADO_FACTURAELECTRONICA = 'A'", [id]);
  return res.rows[0] || null;
};

export const insert = async ({ idFactura, cufe, fecha, xml, observaciones }) => {
  const res = await pool.query(
    `INSERT INTO FACTURACIONELECTRONICA (ID_FACTURA, CUFE_FACTURAELECTRONICA, FECHA_FACTURAELECTRONICA, XML_FACTURAELECTRONICA, OBSERVACIONES_FACTURAELECTRONICA)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [idFactura, cufe, fecha, xml, observaciones]
  );
  return res.rows[0];
};

export const update = async (id, { cufe, fecha, xml, observaciones }) => {
  const res = await pool.query(
    `UPDATE FACTURACIONELECTRONICA
     SET CUFE_FACTURAELECTRONICA = $1, FECHA_FACTURAELECTRONICA = $2, XML_FACTURAELECTRONICA = $3, OBSERVACIONES_FACTURAELECTRONICA = $4
     WHERE ID_FACTURA = $5 AND ESTADO_FACTURAELECTRONICA = 'A'
     RETURNING *`,
    [cufe, fecha, xml, observaciones, id]
  );
  return res.rows[0] || null;
};

export const softDelete = async (id) => {
  const res = await pool.query(
    "UPDATE FACTURACIONELECTRONICA SET ESTADO_FACTURAELECTRONICA = 'I' WHERE ID_FACTURA = $1 RETURNING *",
    [id]
  );
  return res.rowCount > 0;
};
