import { pool } from "../db.js"; // Asegúrate que pool esté correctamente configurado

// Últimos 10 clientes (naturales y jurídicos)
export const getUltimosClientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT ID_CLIENTE, NOMBRE_CLIENTE AS NOMBRE, APELLIDO_CLIENTE AS APELLIDO, FECHANACIMIENTO_CLIENTE AS FECHA, 'NATURAL' AS TIPO
      FROM CLIENTENATURAL
      UNION
      SELECT ID_CLIENTE, RAZONSOCIAL_CLIENTE AS NOMBRE, NOMBRECOMERCIAL_CLIENTE AS APELLIDO, NULL AS FECHA, 'JURIDICO' AS TIPO
      FROM CLIENTEJURIDICO
      ORDER BY ID_CLIENTE DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener últimos clientes:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Últimos 10 abonos de factura
export const getUltimosAbonos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM ABONOFACTURA
      ORDER BY FECHA_ABONOFACTURA DESC
      LIMIT 10
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener abonos:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// Productos con stock bajo
export const getProductosConStockBajo = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.NOMBRE_PRODUCTO, s.NOMBRE_SEDE, i.EXISTENCIA_INVENTARIOLOCAL, i.STOCKMINIMO_INVENTARIOLOCAL
      FROM INVENTARIOLOCAL i
      JOIN PRODUCTO p ON i.ID_PRODUCTO_INVENTARIOLOCAL = p.ID_PRODUCTO
      JOIN SEDE s ON i.ID_SEDE_INVENTARIOLOCAL = s.ID_SEDE
      ORDER BY i.EXISTENCIA_INVENTARIOLOCAL ASC
      LIMIT 5
    `);
    res.json(result.rows);
  } catch (error) {
    console.error('Error al obtener productos con stock bajo:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};



