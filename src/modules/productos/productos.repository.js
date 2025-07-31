import { pool } from "../../db.js";

export const ProductosRepository = {
  obtenerTodos() {
    return pool.query("SELECT * FROM producto WHERE ESTADO_PRODUCTO = 'A'");
  },

  obtenerPorId(id) {
    return pool.query(
      "SELECT * FROM producto WHERE id_producto = $1 AND ESTADO_PRODUCTO = 'A'",
      [id]
    );
  },

  obtenerDetalles() {
    return pool.query(`
      SELECT 
        p.*,
        c.DESCRIPCION_CATEGORIA AS categoria,
        COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_producto
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
      LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
      WHERE p.ESTADO_PRODUCTO = 'A' 
      AND (i.ESTADO_INVENTARIO IS NULL OR i.ESTADO_INVENTARIO = 'A');
    `);
  },

  crearProducto(data) {
    const {
      id_producto,
      id_categoria_producto,
      nombre_producto,
      descripcion_producto,
      precioventaact_producto,
      costoventa_producto,
      margenutilidad_producto,
      valoriva_producto,
    } = data;

    return pool.query(
      `INSERT INTO producto (
        id_producto, id_categoria_producto, nombre_producto, descripcion_producto, 
        precioventaact_producto, costoventa_producto, margenutilidad_producto, valoriva_producto
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        id_producto,
        id_categoria_producto,
        nombre_producto,
        descripcion_producto,
        precioventaact_producto,
        costoventa_producto,
        margenutilidad_producto,
        valoriva_producto,
      ]
    );
  },

  actualizarProducto(productoId, datosActualizados) {
    return pool.query(
      `UPDATE producto 
       SET id_categoria_producto = $1, nombre_producto = $2, descripcion_producto = $3, 
           precioventaact_producto = $4, precioventaant_producto = $5, costoventa_producto = $6, 
           margenutilidad_producto = $7, valoriva_producto = $8, estado_producto = $9
       WHERE id_producto = $10
       RETURNING *`,
      [
        datosActualizados.id_categoria_producto,
        datosActualizados.nombre_producto,
        datosActualizados.descripcion_producto,
        datosActualizados.precioventaact_producto,
        datosActualizados.precioventaant_producto,
        datosActualizados.costoventa_producto,
        datosActualizados.margenutilidad_producto,
        datosActualizados.valoriva_producto,
        datosActualizados.estado_producto,
        productoId,
      ]
    );
  },

  obtenerDetallePorId(productoId) {
    const productoQuery = `
      SELECT 
        p.*, 
        c.DESCRIPCION_CATEGORIA AS categoria,
        COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_total
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
      LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
      WHERE p.ID_PRODUCTO = $1;
    `;

    const inventarioLocalQuery = `
      SELECT 
        il.ID_SEDE_INVENTARIOLOCAL AS sede_id,
        il.EXISTENCIA_INVENTARIOLOCAL AS existencia,
        il.STOCKMINIMO_INVENTARIOLOCAL AS stock_minimo,
        il.STOCKMAXIMO_INVENTARIOLOCAL AS stock_maximo,
        s.NOMBRE_SEDE AS sede_nombre
      FROM INVENTARIOLOCAL il
      JOIN SEDE s ON il.ID_SEDE_INVENTARIOLOCAL = s.ID_SEDE
      WHERE il.ID_PRODUCTO_INVENTARIOLOCAL = $1;
    `;

    return Promise.all([
      pool.query(productoQuery, [productoId]),
      pool.query(inventarioLocalQuery, [productoId]),
    ]);
  },

  eliminarProducto(id) {
    return pool.query(
      "UPDATE PRODUCTO SET ESTADO_PRODUCTO = 'I' WHERE ID_PRODUCTO = $1 RETURNING *",
      [id]
    );
  },

  obtenerProveedoresPorProducto(productoId) {
    return pool.query(
      `SELECT 
          p.ID_PROVEEDOR,
          p.NOMBRE_PROVEEDOR,
          p.TELEFONO_PROVEEDOR,
          p.EMAIL_PROVEEDOR,
          pp.ESTADO_PROVEEDORPRODUCTO
       FROM PROVEEDORPRODUCTO pp
       JOIN PROVEEDOR p ON pp.ID_PROVEEDOR_PROVEEDORPRODUCTO = p.ID_PROVEEDOR
       WHERE pp.ID_PRODUCTO_PROVEEDORPRODUCTO = $1
       AND pp.ESTADO_PROVEEDORPRODUCTO = 'A';`,
      [productoId]
    );
  },
};
