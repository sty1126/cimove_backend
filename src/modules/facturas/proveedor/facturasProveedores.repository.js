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

export const insert = async ({ idOrdenCompra, fecha, monto }) => {
  const res = await pool.query(
    `INSERT INTO FACTURAPROVEEDOR (
      ID_ORDENCOMPRA_FACTURAPROVEEDOR,
      FECHA_FACTURAPROVEEDOR,
      MONTO_FACTURAPROVEEDOR,
      ESTADO_FACTURAPROVEEDOR
    ) VALUES ($1, $2, $3, 'A') RETURNING *`,
    [idOrdenCompra, fecha, monto]
  );
  return res.rows[0];
};
