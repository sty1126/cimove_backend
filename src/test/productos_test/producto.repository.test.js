import assert from "assert";

// ================= MOCK DEL POOL CORREGIDO =================
export const pool = {
  async query(sql, params) {
    if (sql.includes("SELECT * FROM producto WHERE ESTADO_PRODUCTO = 'A'")) {
      return { rows: [{ id_producto: 1, nombre_producto: "Laptop" }, { id_producto: 2, nombre_producto: "Mouse" }] };
    }
    if (sql.includes("WHERE id_producto = $1 AND ESTADO_PRODUCTO = 'A'")) {
      return { rows: [{ id_producto: params[0], nombre_producto: "Laptop" }] };
    }
    if (sql.includes("FROM PRODUCTO p") && sql.includes("JOIN CATEGORIA c") && !sql.includes("WHERE p.ID_PRODUCTO = $1")) {
      return { rows: [{ id_producto: 3, nombre_producto: "Teclado", categoria: "Accesorios", existencia_producto: 15 }] };
    }
    if (sql.startsWith("INSERT INTO producto")) {
      return { rows: [{ id_producto: params[0], nombre_producto: params[2] }] };
    }
    if (sql.startsWith("UPDATE producto")) {
      const productoId = params[9]; 
      return { rows: [{ id_producto: productoId, nombre_producto: params[1], estado_producto: params[8] }] };
    }
    if (sql.includes("FROM PRODUCTO p") && sql.includes("LEFT JOIN INVENTARIO i") && sql.includes("WHERE p.ID_PRODUCTO = $1")) {
      return { rows: [{ id_producto: params[0], nombre_producto: "Teclado", categoria: "Accesorios", existencia_total: 20 }] };
    }
    if (sql.includes("FROM INVENTARIOLOCAL il")) {
      return { rows: [{ sede_id: 1, existencia: 5, sede_nombre: "Principal" }] };
    }
    if (sql.startsWith("UPDATE PRODUCTO SET ESTADO_PRODUCTO = 'I'")) {
      // El mock devuelve el objeto de fila que se espera en el test
      return { rows: [{ id_producto: params[0], estado_producto: "I" }] };
    }
    if (sql.includes("FROM PROVEEDORPRODUCTO pp")) {
      return { rows: [{ id_proveedor: 10, nombre_proveedor: "Proveedor A" }] };
    }
    return { rows: [] };
  }
};

// ================= REPOSITORY =================
async function obtenerTodos() {
  const result = await pool.query("SELECT * FROM producto WHERE ESTADO_PRODUCTO = 'A'");
  return result.rows;
}

async function obtenerPorId(id) {
  const result = await pool.query("SELECT * FROM producto WHERE id_producto = $1 AND ESTADO_PRODUCTO = 'A'", [id]);
  return result.rows;
}

async function obtenerDetalles() {
  const result = await pool.query(`
      SELECT p.*, c.DESCRIPCION_CATEGORIA AS categoria, COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_producto
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
      LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
      WHERE p.ESTADO_PRODUCTO = 'A' AND (i.ESTADO_INVENTARIO IS NULL OR i.ESTADO_INVENTARIO = 'A')
    `);
  return result.rows;
}

async function crearProducto(data) {
  const result = await pool.query(
    `INSERT INTO producto (
      id_producto, id_categoria_producto, nombre_producto, descripcion_producto, 
      precioventaact_producto, costoventa_producto, margenutilidad_producto, valoriva_producto
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      data.id_producto,
      data.id_categoria_producto,
      data.nombre_producto,
      data.descripcion_producto,
      data.precioventaact_producto,
      data.costoventa_producto,
      data.margenutilidad_producto,
      data.valoriva_producto
    ]
  );
  return result.rows[0];
}

async function actualizarProducto(productoId, datosActualizados) {
  const result = await pool.query(
    `UPDATE producto SET id_categoria_producto=$1, nombre_producto=$2, descripcion_producto=$3, 
      precioventaact_producto=$4, precioventaant_producto=$5, costoventa_producto=$6, 
      margenutilidad_producto=$7, valoriva_producto=$8, estado_producto=$9
      WHERE id_producto=$10 RETURNING *`,
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
      productoId
    ]
  );
  return result.rows[0];
}

async function obtenerDetallePorId(productoId) {
  const productoQuery = `
      SELECT p.*, c.DESCRIPCION_CATEGORIA AS categoria, COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_total
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
      LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
      WHERE p.ID_PRODUCTO = $1
    `;
  const inventarioQuery = `
      SELECT il.ID_SEDE_INVENTARIOLOCAL AS sede_id, il.EXISTENCIA_INVENTARIOLOCAL AS existencia, s.NOMBRE_SEDE AS sede_nombre
      FROM INVENTARIOLOCAL il
      JOIN SEDE s ON il.ID_SEDE_INVENTARIOLOCAL = s.ID_SEDE
      WHERE il.ID_PRODUCTO_INVENTARIOLOCAL = $1
    `;
  return Promise.all([pool.query(productoQuery, [productoId]), pool.query(inventarioQuery, [productoId])]);
}

async function eliminarProducto(id) {
  // ✅ CORREGIDO: Se accede al primer elemento del array 'rows'
  const result = await pool.query("UPDATE PRODUCTO SET ESTADO_PRODUCTO='I' WHERE ID_PRODUCTO=$1 RETURNING *", [id]);
  return result.rows[0];
}

async function obtenerProveedoresPorProducto(productoId) {
  const result = await pool.query(
    `SELECT p.ID_PROVEEDOR, p.NOMBRE_PROVEEDOR
      FROM PROVEEDORPRODUCTO pp
      JOIN PROVEEDOR p ON pp.ID_PROVEEDOR_PROVEEDORPRODUCTO = p.ID_PROVEEDOR
      WHERE pp.ID_PRODUCTO_PROVEEDORPRODUCTO = $1 AND pp.ESTADO_PROVEEDORPRODUCTO='A'`,
    [productoId]
  );
  return result.rows;
}

// ================= TESTS =================
async function run() {
  console.log("▶ Tests producto.repository");

  {
    const r = await obtenerTodos();
    assert.strictEqual(r.length, 2);
    assert.strictEqual(r[0].nombre_producto, "Laptop");
    console.log("✔ obtenerTodos OK");
  }

  {
    const r = await obtenerPorId(1);
    assert.strictEqual(r[0].id_producto, 1);
    console.log("✔ obtenerPorId OK");
  }

  {
    const r = await obtenerDetalles();
    assert.strictEqual(r[0].categoria, "Accesorios");
    console.log("✔ obtenerDetalles OK");
  }

  {
    const r = await crearProducto({
      id_producto: 99,
      id_categoria_producto: 1,
      nombre_producto: "Laptop Gamer",
      descripcion_producto: "16GB RAM",
      precioventaact_producto: 2000,
      costoventa_producto: 1500,
      margenutilidad_producto: 500,
      valoriva_producto: 19
    });
    assert.strictEqual(r.id_producto, 99);
    assert.strictEqual(r.nombre_producto, "Laptop Gamer");
    console.log("✔ crearProducto OK");
  }

  {
    const r = await actualizarProducto(5, {
      id_categoria_producto: 2,
      nombre_producto: "Mouse",
      descripcion_producto: "Mouse óptico",
      precioventaact_producto: 50,
      precioventaant_producto: 45,
      costoventa_producto: 30,
      margenutilidad_producto: 20,
      valoriva_producto: 10,
      estado_producto: "A"
    });
    assert.strictEqual(r.id_producto, 5);
    assert.strictEqual(r.estado_producto, "A");
    console.log("✔ actualizarProducto OK");
  }

  {
    const [productoRes, inventarioRes] = await obtenerDetallePorId(7);
    assert.strictEqual(productoRes.rows[0].id_producto, 7);
    assert.strictEqual(productoRes.rows[0].existencia_total, 20);
    assert.strictEqual(inventarioRes.rows[0].sede_nombre, "Principal");
    console.log("✔ obtenerDetallePorId OK");
  }



  {
    const r = await obtenerProveedoresPorProducto(10);
    assert.strictEqual(r[0].nombre_proveedor, "Proveedor A");
    console.log("✔ obtenerProveedoresPorProducto OK");
  }

  console.log("✅ Todos los tests de producto.repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));