import { pool } from "../db.js";

// Obtener todas las facturas electrónicas activas
export const getFacturasElectronicas = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM FACTURACIONELECTRONICA WHERE ESTADO_FACTURAELECTRONICA = 'A'"
  );
  res.json(result.rows);
};

// Obtener una factura electrónica por ID
export const getFacturaElectronicaById = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "SELECT * FROM FACTURACIONELECTRONICA WHERE ID_FACTURA = $1 AND ESTADO_FACTURAELECTRONICA = 'A'",
    [id]
  );
  if (result.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "Factura electrónica no encontrada" });
  }
  res.json(result.rows[0]);
};

// Crear nueva factura electrónica
export const createFacturaElectronica = async (req, res) => {
  const { idFactura, cufe, fecha, xml, observaciones } = req.body;

  const result = await pool.query(
    `INSERT INTO FACTURACIONELECTRONICA 
    (ID_FACTURA, CUFE_FACTURAELECTRONICA, FECHA_FACTURAELECTRONICA, XML_FACTURAELECTRONICA, OBSERVACIONES_FACTURAELECTRONICA)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *`,
    [idFactura, cufe, fecha, xml, observaciones]
  );
  res.json(result.rows[0]);
};

// Eliminar lógicamente una factura electrónica
export const deleteFacturaElectronica = async (req, res) => {
  const { id } = req.params;
  const result = await pool.query(
    "UPDATE FACTURACIONELECTRONICA SET ESTADO_FACTURAELECTRONICA = 'I' WHERE ID_FACTURA = $1 RETURNING *",
    [id]
  );
  if (result.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "Factura electrónica no encontrada" });
  }
  res.json({ message: "Factura electrónica eliminada correctamente" });
};

// Actualizar una factura electrónica
export const updateFacturaElectronica = async (req, res) => {
  const { id } = req.params;
  const { cufe, fecha, xml, observaciones } = req.body;

  const result = await pool.query(
    `UPDATE FACTURACIONELECTRONICA
       SET 
         CUFE_FACTURAELECTRONICA = $1,
         FECHA_FACTURAELECTRONICA = $2,
         XML_FACTURAELECTRONICA = $3,
         OBSERVACIONES_FACTURAELECTRONICA = $4
       WHERE ID_FACTURA = $5 AND ESTADO_FACTURAELECTRONICA = 'A'
       RETURNING *`,
    [cufe, fecha, xml, observaciones, id]
  );

  if (result.rows.length === 0) {
    return res
      .status(404)
      .json({ message: "Factura electrónica no encontrada o inactiva" });
  }

  res.json({
    message: "Factura electrónica actualizada correctamente",
    factura: result.rows[0],
  });
};
