import assert from "assert";

// ================= MOCK DEL POOL =================
export const pool = {
  async query(sql, params) {
    // Simulación de resultados según la consulta
    if (sql.includes("FROM ORDENCOMPRA o")) {
      return { rows: [{ id_ordencompra: 1, nombre_proveedor: "Proveedor 1" }] };
    }
    if (sql.startsWith("INSERT INTO ordencompra")) {
      return { rows: [{ id_ordencompra: 2, id_proveedor_ordencompra: params[0], total_ordencompra: params[2] }] };
    }
    if (sql.includes("WHERE oc.id_ordencompra = $1")) {
      return { rows: [{ id_ordencompra: params[0], nombre_proveedor: "ProvX" }] };
    }
    if (sql.includes("SELECT costoventa_producto FROM producto")) {
      return { rows: [{ costoventa_producto: 99 }] };
    }
    return { rows: [] };
  },
  async connect() {
    return this; // devolvemos el mismo mock como client
  },
  async release() {
    return true;
  }
};

// ================= REPOSITORY =================
async function obtenerOrdenes() {
  return pool.query(`
      SELECT o.id_ordencompra, p.nombre_proveedor
      FROM ORDENCOMPRA o
      JOIN PROVEEDOR p ON o.id_proveedor_ordencompra = p.id_proveedor
      WHERE o.estado_facturaproveedor = 'A'
    `);
}

async function crearOrden({ id_proveedor, fecha, total }) {
  return pool.query(
    `INSERT INTO ordencompra (id_ordencompra, id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
     VALUES (DEFAULT, $1, $2, $3) RETURNING *`,
    [id_proveedor, fecha, total]
  );
}

async function obtenerOrdenPorId(id) {
  return pool.query(
    `SELECT oc.*, p.nombre_proveedor
     FROM ordencompra oc
     JOIN proveedor p ON oc.id_proveedor_ordencompra = p.id_proveedor
     WHERE oc.id_ordencompra = $1 AND oc.estado_facturaproveedor = 'A'`,
    [id]
  );
}

async function obtenerPrecioProducto(id_producto) {
  return pool.query(
    `SELECT costoventa_producto FROM producto WHERE id_producto = $1`,
    [id_producto]
  );
}

async function crearConexion() {
  return await pool.connect();
}

// ================= TESTS =================
async function run() {
  console.log("▶ Tests ordenesCompra.repository");

  {
    const r = await obtenerOrdenes();
    assert.strictEqual(r.rows[0].nombre_proveedor, "Proveedor 1");
    console.log("✔ obtenerOrdenes OK");
  }

  {
    const r = await crearOrden({ id_proveedor: 10, fecha: "2025-09-01", total: 500 });
    assert.strictEqual(r.rows[0].id_proveedor_ordencompra, 10);
    assert.strictEqual(r.rows[0].total_ordencompra, 500);
    console.log("✔ crearOrden OK");
  }

  {
    const r = await obtenerOrdenPorId(3);
    assert.strictEqual(r.rows[0].id_ordencompra, 3);
    assert.strictEqual(r.rows[0].nombre_proveedor, "ProvX");
    console.log("✔ obtenerOrdenPorId OK");
  }

  {
    const r = await obtenerPrecioProducto(7);
    assert.strictEqual(r.rows[0].costoventa_producto, 99);
    console.log("✔ obtenerPrecioProducto OK");
  }

  {
    const client = await crearConexion();
    assert.ok(client.query);
    console.log("✔ crearConexion OK");
  }

  console.log("✅ Todos los tests de ordenesCompra.repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
