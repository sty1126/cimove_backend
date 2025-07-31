import { pool } from "../../db.js";

export const OrdenesCompraRepository = {
  async obtenerOrdenes() {
    return pool.query(`
      SELECT 
        o.id_ordencompra,
        o.fecha_ordencompra,
        o.total_ordencompra,
        o.estado_facturaproveedor,
        p.id_proveedor,
        p.nombre_proveedor,
        d.id_detalleordencompra,
        d.id_producto_detalleordencompra,
        prod.nombre_producto,
        d.cantidad_detalleordencompra,
        d.preciounitario_detalleordencompra,
        d.subtotal_detalleordencompra 
      FROM ORDENCOMPRA o
      JOIN PROVEEDOR p ON o.id_proveedor_ordencompra = p.id_proveedor
      LEFT JOIN DETALLEORDENCOMPRA d ON o.id_ordencompra = d.id_ordencompra_detalleordencompra
      LEFT JOIN PRODUCTO prod ON d.id_producto_detalleordencompra = prod.id_producto
      WHERE o.estado_facturaproveedor = 'A' AND p.estado_proveedor = 'A'
      ORDER BY o.fecha_ordencompra DESC
    `);
  },

  async crearOrden({ id_proveedor, fecha, total }) {
    return pool.query(
      `INSERT INTO ordencompra (id_ordencompra, id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
       VALUES (DEFAULT, $1, $2, $3) RETURNING *`,
      [id_proveedor, fecha, total]
    );
  },

  async obtenerOrdenPorId(id) {
    return pool.query(
      `
      SELECT oc.*, p.nombre_proveedor
      FROM ordencompra oc
      JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
      WHERE oc.id_ordencompra = $1 AND oc.estado_facturaproveedor = 'A'
    `,
      [id]
    );
  },

  async obtenerPrecioProducto(id_producto) {
    return pool.query(`SELECT costoventa_producto FROM producto WHERE id_producto = $1`, [id_producto]);
  },

  async crearConexion() {
    return await pool.connect();
  }
};
