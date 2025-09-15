
import assert from "assert";

// ======================
// Pool mock
// ======================
export const pool = {
  async query(sql, params) {
    // según cada query
    // Mock para obtenerPorProducto
    if (sql.toUpperCase().includes("WHERE PP.ID_PRODUCTO_PROVEEDORPRODUCTO = $1")) {
      return {
        rows: [
          { id_proveedorproducto: 1, id_proveedor: 101, nombre_proveedor: "Proveedor A" },
          { id_proveedorproducto: 2, id_proveedor: 102, nombre_proveedor: "Proveedor B" },
        ],
      };
    }

    // Mock para obtenerPorVariosProductos (CORREGIDO)
    if (sql.toUpperCase().includes("ANY($1)")) {
      return {
        rows: [
          { id_producto: params[0][0], id_proveedor: 101, nombre_proveedor: "Proveedor A" },
          { id_producto: params[0][1], id_proveedor: 103, nombre_proveedor: "Proveedor C" },
        ],
      };
    }

    // Mock para obtenerPorProveedor
    if (sql.toUpperCase().includes("WHERE PP.ID_PROVEEDOR_PROVEEDORPRODUCTO = $1")) {
      return {
        rows: [
          { id_producto: 201, nombre_producto: "Producto X" },
          { id_producto: 202, nombre_producto: "Producto Y" },
        ],
      };
    }

    // Mock para asociarProveedorAProducto
    if (sql.toUpperCase().includes("INSERT INTO PROVEEDORPRODUCTO")) {
      return {
        rows: [{
          id_proveedorproducto: 99,
          id_proveedor_proveedorproducto: params[0],
          id_producto_proveedorproducto: params[1],
          estado_proveedorproducto: 'A',
        }]
      };
    }

    // Mock para desasociarProveedor
    if (sql.toUpperCase().includes("UPDATE PROVEEDORPRODUCTO") && sql.toUpperCase().includes("SET ESTADO_PROVEEDORPRODUCTO = 'I'")) {
      return {
        rows: [{ id_proveedorproducto: params[0], estado_proveedorproducto: 'I' }]
      };
    }

    return { rows: [] };
  }
};

// ======================
// Repository functions
// ======================
async function obtenerPorProducto(id_producto) {
  return pool.query(
    `SELECT pp.id_proveedorproducto, p.id_proveedor, p.nombre_proveedor
       FROM PROVEEDORPRODUCTO pp
       JOIN PROVEEDOR p ON pp.id_proveedor_proveedorproducto = p.id_proveedor
       WHERE pp.id_producto_proveedorproducto = $1
         AND pp.estado_proveedorproducto = 'A'`,
    [id_producto]
  );
}

async function obtenerPorVariosProductos(idList) {
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
}

async function obtenerPorProveedor(id_proveedor) {
  return pool.query(
    `SELECT pr.id_producto, pr.nombre_producto
      FROM PROVEEDORPRODUCTO pp
      JOIN PRODUCTO pr ON pp.id_producto_proveedorproducto = pr.id_producto
      WHERE pp.id_proveedor_proveedorproducto = $1
        AND pp.estado_proveedorproducto = 'A'`,
    [id_proveedor]
  );
}

async function asociarProveedorAProducto({ id_proveedor_proveedorproducto, id_producto_proveedorproducto }) {
  return pool.query(
    `INSERT INTO PROVEEDORPRODUCTO
      (id_proveedor_proveedorproducto, id_producto_proveedorproducto, estado_proveedorproducto)
      VALUES ($1, $2, 'A') RETURNING *`,
    [id_proveedor_proveedorproducto, id_producto_proveedorproducto]
  );
}

async function desasociarProveedor(id_proveedorproducto) {
  return pool.query(
    `UPDATE PROVEEDORPRODUCTO
      SET estado_proveedorproducto = 'I'
      WHERE id_proveedorproducto = $1 RETURNING *`,
    [id_proveedorproducto]
  );
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests proveedorproducto.repository");

  // Test 1: obtenerPorProducto
  {
    const res = await obtenerPorProducto(1);
    assert.strictEqual(res.rows.length, 2);
    assert.strictEqual(res.rows[0].nombre_proveedor, "Proveedor A");
    console.log("✔ obtenerPorProducto OK");
  }

  // Test 2: obtenerPorVariosProductos
  {
    const res = await obtenerPorVariosProductos([1, 2]);
    assert.strictEqual(res.rows.length, 2);
    assert.strictEqual(res.rows[0].id_producto, 1);
    assert.strictEqual(res.rows[1].id_producto, 2);
    console.log("✔ obtenerPorVariosProductos OK");
  }

  // Test 3: obtenerPorProveedor
  {
    const res = await obtenerPorProveedor(101);
    assert.strictEqual(res.rows.length, 2);
    assert.strictEqual(res.rows[0].nombre_producto, "Producto X");
    console.log("✔ obtenerPorProveedor OK");
  }

  // Test 4: asociarProveedorAProducto
  {
    const data = { id_proveedor_proveedorproducto: 1, id_producto_proveedorproducto: 1 };
    const res = await asociarProveedorAProducto(data);
    assert.strictEqual(res.rows[0].estado_proveedorproducto, "A");
    assert.strictEqual(res.rows[0].id_proveedor_proveedorproducto, 1);
    console.log("✔ asociarProveedorAProducto OK");
  }

  // Test 5: desasociarProveedor
  {
    const res = await desasociarProveedor(1);
    assert.strictEqual(res.rows[0].estado_proveedorproducto, "I");
    assert.strictEqual(res.rows[0].id_proveedorproducto, 1);
    console.log("✔ desasociarProveedor OK");
  }

  console.log("✅ Todos los tests de proveedorproducto.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});