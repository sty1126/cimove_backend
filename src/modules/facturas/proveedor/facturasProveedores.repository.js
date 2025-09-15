import { pool } from "../../../db.js";

export const findAll = async () => {
  const query = `
    SELECT
      f.id_facturaproveedor,
      f.fecha_facturaproveedor,
      f.monto_facturaproveedor,
      f.estado_facturaproveedor,

      p.id_proveedor,
      p.nombre_proveedor,

      -- total abonado calculado por factura (subconsulta para evitar duplicados)
      COALESCE(
        (
          SELECT SUM(a.monto_abonofactura)
          FROM abonofactura a
          WHERE a.id_facturaproveedor_abonofactura = f.id_facturaproveedor
            AND a.estado_abonofactura = 'A'
        ), 0
      ) AS total_abonado,

      -- saldo pendiente (monto factura - total abonado)
      f.monto_facturaproveedor - COALESCE(
        (
          SELECT SUM(a.monto_abonofactura)
          FROM abonofactura a
          WHERE a.id_facturaproveedor_abonofactura = f.id_facturaproveedor
            AND a.estado_abonofactura = 'A'
        ), 0
      ) AS saldo_pendiente,

      -- detalles agrupados en un array JSONB (vacío si no hay detalles)
      COALESCE(
        JSONB_AGG(
          JSONB_BUILD_OBJECT(
            'id_detalle', d.id_detallefacturaproveedor,
            'id_producto', pr.id_producto,
            'nombre_producto', pr.nombre_producto,
            'cantidad', d.cantidad_detalle,
            'precio_unitario', d.preciounitario_detalle,
            'subtotal', d.subtotal_detalle
          )
        ) FILTER (WHERE d.id_detallefacturaproveedor IS NOT NULL),
        '[]'::jsonb
      ) AS detalles

    FROM facturaproveedor f
    JOIN ordencompra oc
      ON f.id_ordencompra_facturaproveedor = oc.id_ordencompra
    JOIN proveedor p
      ON oc.id_proveedor_ordencompra = p.id_proveedor
    LEFT JOIN detallefacturaproveedor d
      ON f.id_facturaproveedor = d.id_facturaproveedor_detalle
    LEFT JOIN producto pr
      ON d.id_producto_detalle = pr.id_producto

    WHERE f.estado_facturaproveedor = 'A'

    GROUP BY
      f.id_facturaproveedor,
      f.fecha_facturaproveedor,
      f.monto_facturaproveedor,
      f.estado_facturaproveedor,
      p.id_proveedor,
      p.nombre_proveedor

    ORDER BY f.id_facturaproveedor DESC;
  `;

  const { rows } = await pool.query(query);
  return rows;
};

export const findById = async (id) => {
  const res = await pool.query(
    "SELECT * FROM FACTURAPROVEEDOR WHERE ID_FACTURAPROVEEDOR = $1",
    [id]
  );
  return res.rows[0] || null;
};


export const insert = async ({
  id_ordencompra,
  fecha_facturaproveedor,
  monto_facturaproveedor,
  detalles,
}) => {
  const client = await pool.connect();
  console.log("REPOSITORY insert recibió:", { id_ordencompra, fecha_facturaproveedor, monto_facturaproveedor });
  console.log("REPOSITORY detalles:", detalles);
  
  try {
    await client.query("BEGIN");

    // 1. Insertar la factura
    const facturaRes = await client.query(
      `INSERT INTO FACTURAPROVEEDOR (
        ID_ORDENCOMPRA_FACTURAPROVEEDOR,
        FECHA_FACTURAPROVEEDOR,
        MONTO_FACTURAPROVEEDOR,
        ESTADO_FACTURAPROVEEDOR
      ) VALUES ($1, $2, $3, 'A') RETURNING *`,
      [id_ordencompra, fecha_facturaproveedor, monto_facturaproveedor]
    );

    const factura = facturaRes.rows[0];

    // 2. Insertar detalles (si vienen)
    if (detalles && detalles.length > 0) {
      for (const det of detalles) {
        await client.query(
          `INSERT INTO DETALLEFACTURAPROVEEDOR (
            ID_FACTURAPROVEEDOR_DETALLE,
            ID_PRODUCTO_DETALLE,
            CANTIDAD_DETALLE,
            PRECIOUNITARIO_DETALLE,
            SUBTOTAL_DETALLE,
            ESTADO_DETALLE
          ) VALUES ($1, $2, $3, $4, $5, 'A')`,
          [
            factura.id_facturaproveedor,
            det.id_producto,
            det.cantidad,
            det.precio_unitario,
            det.subtotal,
          ]
        );
      }
    }

    await client.query("COMMIT");
    return factura;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
};

// Helper: trae orden + detalles y normaliza nombres
const getOrdenCompraById = async (id) => {
  const query = `
    SELECT 
      oc.id_ordencompra,
      oc.fecha_ordencompra,
      oc.total_ordencompra,
      d.id_producto_detalleordencompra AS id_producto,
      d.cantidad_detalleordencompra AS cantidad,
      d.preciounitario_detalleordencompra AS precio_unitario,
      d.subtotal_detalleordencompra AS subtotal
    FROM ordencompra oc
    LEFT JOIN detalleordencompra d
      ON oc.id_ordencompra = d.id_ordencompra_detalleordencompra
    WHERE oc.id_ordencompra = $1
  `;
  const { rows } = await pool.query(query, [id]);
  if (rows.length === 0) return null;

  // Construimos un objeto orden con un array de detalles (filtrando filas sin producto)
  const detalles = rows
    .filter((r) => r.id_producto !== null && r.id_producto !== undefined)
    .map((r) => ({
      id_producto: String(r.id_producto),
      cantidad: Number(r.cantidad) || 0,
      precio_unitario: Number(r.precio_unitario) || 0,
      subtotal: Number(r.subtotal) || (Number(r.cantidad || 0) * Number(r.precio_unitario || 0)),
    }));

  return {
    id_ordencompra: rows[0].id_ordencompra,
    fecha_ordencompra: rows[0].fecha_ordencompra,
    total_ordencompra: rows[0].total_ordencompra,
    detalles,
  };
};

export const createFacturaProveedor = async (req, res) => {
  try {
    console.log("Request body createFacturaProveedor:", req.body);

    // Aceptamos varias formas de recibir el id (frontend puede mandar id_ordencompra)
    const incomingId =
      req.body?.id_ordencompra ??
      req.body?.idOrdenCompra ??
      req.body?.id_orden ??
      req.body?.id;

    if (!incomingId) {
      return res.status(400).json({ error: "Falta id_ordencompra en el body" });
    }

    // 1) Traemos la orden completa desde la BD (para asegurar fecha, total y detalles)
    const orden = await getOrdenCompraById(incomingId);
    if (!orden) {
      return res.status(404).json({ error: "Orden de compra no encontrada" });
    }
    console.log("Orden encontrada en DB:", orden);

    // 2) Calculamos / resolvemos monto_facturaproveedor
    // preferimos lo que el frontend mandó si existe; si no, usamos total_ordencompra; si tampoco, sumamos los subtotales
    let monto =
      req.body?.monto_facturaproveedor ??
      req.body?.monto ??
      orden.total_ordencompra;

    // si sigue sin monto, sumamos detalles
    if (monto === undefined || monto === null) {
      monto = orden.detalles.reduce(
        (s, d) => s + (Number(d.subtotal) || Number(d.cantidad) * Number(d.precio_unitario) || 0),
        0
      );
    }

    // 3) Normalizar fecha a YYYY-MM-DD (factura espera DATE)
    const fechaRaw = req.body?.fecha_facturaproveedor ?? req.body?.fecha ?? orden.fecha_ordencompra;
    const fecha_facturaproveedor = fechaRaw
      ? (typeof fechaRaw === "string" ? fechaRaw.split("T")[0] : new Date(fechaRaw).toISOString().split("T")[0])
      : new Date().toISOString().split("T")[0]; // fallback hoy

    // 4) Armamos payload exactamente con las keys que espera repository.insert
    const payload = {
      id_ordencompra: orden.id_ordencompra,
      fecha_facturaproveedor,
      monto_facturaproveedor: Number(monto) || 0,
      detalles: orden?.detalles ?? [],
    };

    console.log("Payload a insertar factura:", payload);

    // 5) Insertamos (repository ya hace transaction e inserta detalles)
    const facturaCreada = await repository.insert(payload);

    return res.status(201).json({
      message: "Factura proveedor creada con éxito",
      factura: facturaCreada,
    });
  } catch (error) {
    console.error("Error al crear factura proveedor:", error);
    return res.status(500).json({ error: "Error al crear factura proveedor" });
  }
};

export { getOrdenCompraById };
