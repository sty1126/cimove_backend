import { pool } from "../../../db.js";

export const ProveedorProductoRepository = {
  obtenerPorProducto(id_producto) {
    return pool.query(
      `SELECT pp.id_proveedorproducto, p.id_proveedor, p.nombre_proveedor 
       FROM PROVEEDORPRODUCTO pp
       JOIN PROVEEDOR p ON pp.id_proveedor_proveedorproducto = p.id_proveedor
       WHERE pp.id_producto_proveedorproducto = $1
         AND pp.estado_proveedorproducto = 'A'`,
      [id_producto]
    );
  },

  obtenerPorVariosProductos(idList) {
    return pool.query(
      `SELECT 
        pp.id_producto_proveedorproducto AS id_producto,
        p.id_proveedor,
        p.nombre_proveedor
       FROM proveedorproducto pp
       JOIN proveedor p ON p.id_proveedor = pp.id_proveedor_proveedorproducto
       WHERE pp.estado_proveedorproducto = 'A'
         AND pp.id_producto_proveedorproducto = ANY($1)`,
      [idList]
    );
  },

  asociarProveedorAProducto({ id_proveedor_proveedorproducto, id_producto_proveedorproducto }) {
    return pool.query(
      `INSERT INTO PROVEEDORPRODUCTO 
        (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
       VALUES ($1, $2, 'A') RETURNING *`,
      [id_proveedor_proveedorproducto, id_producto_proveedorproducto]
    );
  },

  desasociarProveedor(id_proveedorproducto) {
    return pool.query(
      `UPDATE PROVEEDORPRODUCTO 
       SET estado_proveedorproducto = 'I' 
       WHERE id_proveedorproducto = $1 RETURNING *`,
      [id_proveedorproducto]
    );
  },
};
