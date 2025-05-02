import { pool } from "../db.js";

export const getFacturasProveedor = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          f.id_facturaproveedor, 
          f.fecha_facturaproveedor, 
          f.monto_facturaproveedor,
          COALESCE(SUM(a.monto_abonofactura), 0) AS total_abonado,
          f.monto_facturaproveedor - COALESCE(SUM(a.monto_abonofactura), 0) AS saldo_pendiente,
          p.nombre_proveedor,
          f.estado_facturaproveedor
        FROM facturaproveedor f
        JOIN ordencompra oc ON f.id_ordencompra_facturaproveedor = oc.id_ordencompra
        JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
        LEFT JOIN abonofactura a ON a.id_facturaproveedor_abonofactura = f.id_facturaproveedor
        WHERE f.estado_facturaproveedor = 'A'
        GROUP BY f.id_facturaproveedor, f.fecha_facturaproveedor, f.monto_facturaproveedor, p.nombre_proveedor
      `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener las facturas:", error);
    res.status(500).json({ error: "Error al obtener las facturas" });
  }
};

// Crear factura
export const createFacturaProveedor = async (req, res) => {
  const { id_ordencompra, fecha, monto } = req.body;
  try {
    const result = await pool.query(
      `
      INSERT INTO facturaproveedor (id_ordencompra_facturaproveedor, fecha_facturaproveedor, monto_facturaproveedor)
      VALUES ($1, $2, $3)
      RETURNING *
    `,
      [id_ordencompra, fecha, monto]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: "Error al crear la factura del proveedor" });
    console.log(error)
  }
};

export const getProductosOrdenParaFactura = async (req, res) => {
  const { id_ordencompra } = req.params;
  try {
    const result = await pool.query(
      `
        SELECT 
          p.id_producto,
          p.nombre_producto,
          d.cantidad_detalleordencompra AS cantidad_ordenada,
          d.preciounitario_detalleordencompra
        FROM detalleordencompra d
        JOIN producto p ON d.id_producto_detalleordencompra = p.id_producto
        WHERE d.id_ordencompra_detalleordencompra = $1 AND d.estado_detalleordencompra = 'A'
      `,
      [id_ordencompra]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener productos de la orden:", error);
    res.status(500).json({ error: "Error al cargar productos" });
  }
};

export const crearFacturaPersonalizada = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_ordencompra, productos } = req.body;
    const fecha = new Date();

    await client.query("BEGIN");

    const total = productos.reduce(
      (acc, p) => acc + p.cantidad * p.precio_unitario,
      0
    );

    const facturaRes = await client.query(
      `INSERT INTO facturaproveedor (id_ordencompra_facturaproveedor, fecha_facturaproveedor, monto_facturaproveedor)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [id_ordencompra, fecha, total]
    );

    const factura = facturaRes.rows[0];

    for (const p of productos) {
      const subtotal = p.cantidad * p.precio_unitario;
      await client.query(
        `INSERT INTO detallefacturaproveedor 
           (id_facturaproveedor_detalle, id_producto_detalle, cantidad_detalle, preciounitario_detalle, subtotal_detalle)
           VALUES ($1, $2, $3, $4, $5)`,
        [
          factura.id_facturaproveedor,
          p.id_producto,
          p.cantidad,
          p.precio_unitario,
          subtotal,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({ mensaje: "Factura creada con éxito", factura });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creando factura personalizada:", error);
    res.status(500).json({ error: "Error al crear factura" });
  } finally {
    client.release();
  }
};


export const generarFacturaDesdeOrden = async (req, res) => {
  const client = await pool.connect();
  try {
    const { id_ordencompra } = req.body;
    const fecha = new Date();

    await client.query("BEGIN");

    // Obtener los detalles de la orden
    const detalleRes = await client.query(
      `SELECT id_producto_detalleordencompra, cantidad_detalleordencompra, preciounitario_detalleordencompra
         FROM detalleordencompra
         WHERE id_ordencompra_detalleordencompra = $1 AND estado_detalleordencompra = 'A'`,
      [id_ordencompra]
    );

    const detalles = detalleRes.rows;

    if (detalles.length === 0) {
      throw new Error("La orden no tiene productos activos");
    }

    // Calcular el total de la factura
    const total = detalles.reduce(
      (acc, item) =>
        acc +
        item.cantidad_detalleordencompra *
          item.preciounitario_detalleordencompra,
      0
    );

    // Insertar la factura
    const facturaRes = await client.query(
      `INSERT INTO facturaproveedor (id_ordencompra_facturaproveedor, fecha_facturaproveedor, monto_facturaproveedor)
         VALUES ($1, $2, $3)
         RETURNING *`,
      [id_ordencompra, fecha, total]
    );

    const factura = facturaRes.rows[0];

    // Insertar el detalle de la factura
    for (const d of detalles) {
      const subtotal =
        d.cantidad_detalleordencompra * d.preciounitario_detalleordencompra;
      await client.query(
        `INSERT INTO detallefacturaproveedor 
           (id_facturaproveedor_detalle, id_producto_detalle, cantidad_detalle, preciounitario_detalle, subtotal_detalle)
           VALUES ($1, $2, $3, $4, $5)`,
        [
          factura.id_facturaproveedor,
          d.id_producto_detalleordencompra,
          d.cantidad_detalleordencompra,
          d.preciounitario_detalleordencompra,
          subtotal,
        ]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      mensaje: "Factura generada correctamente",
      factura,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al generar factura desde orden:", error);
    res
      .status(500)
      .json({ error: "Error al generar la factura desde la orden" });
  } finally {
    client.release();
  }
};
  export const getFacturaProveedorById = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await pool.query(
        `SELECT * FROM facturaproveedor WHERE id_facturaproveedor = $1`,
        [id]
      );
  
      if (result.rowCount === 0) {
        return res.status(404).json({ error: "Factura no encontrada" });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error("Error al obtener factura:", error);
      res.status(500).json({ error: "Error al obtener factura" });
    }
};
  

