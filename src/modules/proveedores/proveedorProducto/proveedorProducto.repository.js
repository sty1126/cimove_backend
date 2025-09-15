import { pool } from "../../../db.js";

export const obtenerPorProducto = (id_producto) => {
  return pool.query(
    `SELECT pp.id_proveedorproducto, p.id_proveedor, p.nombre_proveedor 
     FROM PROVEEDORPRODUCTO pp
     JOIN PROVEEDOR p ON pp.id_proveedor_proveedorproducto = p.id_proveedor
     WHERE pp.id_producto_proveedorproducto = $1
       AND pp.estado_proveedorproducto = 'A'`,
    [id_producto]
  );
};

export const obtenerPorVariosProductos = (idList) => {
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
};

export const obtenerPorProveedor = (id_proveedor) => {
  return pool.query(
    `SELECT pr.id_producto, pr.nombre_producto
     FROM PROVEEDORPRODUCTO pp
     JOIN PRODUCTO pr ON pp.id_producto_proveedorproducto = pr.id_producto
     WHERE pp.id_proveedor_proveedorproducto = $1
       AND pp.estado_proveedorproducto = 'A'`,
    [id_proveedor]
  );
};

export const verificarAsociacionExistente = (id_proveedor, id_producto) => {
  return pool.query(
    `SELECT EXISTS (
      SELECT 1 FROM PROVEEDORPRODUCTO 
      WHERE id_proveedor_proveedorproducto = $1 
        AND id_producto_proveedorproducto = $2
        AND estado_proveedorproducto = 'A'
    ) AS existe`,
    [id_proveedor, id_producto]
  );
};

export const reactivarAsociacion = (id_proveedor, id_producto) => {
  return pool.query(
    `UPDATE PROVEEDORPRODUCTO
     SET estado_proveedorproducto = 'A'
     WHERE id_proveedor_proveedorproducto = $1
       AND id_producto_proveedorproducto = $2
       AND estado_proveedorproducto = 'I'
     RETURNING *`,
    [id_proveedor, id_producto]
  );
};

export const asociarProveedorAProducto = async ({ id_proveedor_proveedorproducto, id_producto_proveedorproducto }) => {
  const existe = await pool.query(
    `SELECT id_proveedorproducto, estado_proveedorproducto 
     FROM PROVEEDORPRODUCTO
     WHERE id_proveedor_proveedorproducto = $1
       AND id_producto_proveedorproducto = $2`,
    [id_proveedor_proveedorproducto, id_producto_proveedorproducto]
  );

  if (existe.rows.length > 0) {
    if (existe.rows[0].estado_proveedorproducto === 'I') {
      // Si existe pero está inactivo, lo reactivamos
      return reactivarAsociacion(id_proveedor_proveedorproducto, id_producto_proveedorproducto);
    }
    // Si ya está activo, simplemente lo devolvemos
    return existe.rows[0];
  }

  // Si no existe, lo insertamos
  return pool.query(
    `INSERT INTO PROVEEDORPRODUCTO 
    (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
    VALUES ($1, $2, 'A') RETURNING *`,
    [id_proveedor_proveedorproducto, id_producto_proveedorproducto]
  );
};

export const desasociarProveedor = (id_proveedorproducto) => {
  return pool.query(
    `UPDATE PROVEEDORPRODUCTO 
     SET estado_proveedorproducto = 'I' 
     WHERE id_proveedorproducto = $1 RETURNING *`,
    [id_proveedorproducto]
  );
};

export const inactivarAsociacion = (id_proveedor, id_producto) => {
  console.log("📦 inactivarAsociacion -> INICIO", { 
    id_proveedor, 
    id_producto,
    tipo_proveedor: typeof id_proveedor,
    tipo_producto: typeof id_producto 
  });
  
  try {
    // Aseguramos que id_producto sea un número si viene como string
    let productoId = id_producto;
    if (typeof id_producto === 'string') {
      productoId = id_producto.replace(/\D/g, ''); // Eliminar caracteres no numéricos
      productoId = parseInt(productoId, 10);
      console.log("ID producto convertido:", productoId);
    }
    
    // Aseguramos que id_proveedor sea un string sin guiones
    let proveedorId = id_proveedor;
    if (typeof id_proveedor === 'string') {
      proveedorId = id_proveedor.replace(/\D/g, ''); // Eliminar caracteres no numéricos como guiones
      console.log("ID proveedor normalizado:", proveedorId);
    }
    
    // Ejecutar la consulta SQL
    return pool.query(
      `UPDATE proveedorproducto
       SET estado_proveedorproducto = 'I'
       WHERE id_proveedor_proveedorproducto = $1
         AND id_producto_proveedorproducto = $2
         AND estado_proveedorproducto = 'A'
       RETURNING *`,
      [proveedorId, productoId]
    ).then(result => {
      console.log("📦 inactivarAsociacion -> Filas afectadas:", result.rowCount);
      console.log("📦 inactivarAsociacion -> Datos retornados:", result.rows);
      return result;
    }).catch(err => {
      console.error("📦 inactivarAsociacion -> ERROR SQL:", err.message);
      console.error("📦 Detalles del error:", err);
      throw err;
    });
  } catch (err) {
    console.error("❌ Error general en inactivarAsociacion:", err);
    throw err;
  }
};
