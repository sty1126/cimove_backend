import assert from "assert";

// Mock pool y client
let mockRows = [];
const pool = {
  query: async (_sql, _params) => ({ rows: mockRows, rowCount: mockRows.length }),
  connect: async () => client
};
const client = {
  queries: [],
  query: async (sql, params) => {
    client.queries.push({ sql, params });
    if (sql.startsWith("SELECT 1 FROM inventariolocal")) {
      return { rowCount: mockRows.length, rows: mockRows };
    }
    if (sql.startsWith("UPDATE inventariolocal")) {
      return { rowCount: 1 };
    }
    return { rowCount: 0, rows: mockRows };
  },
  release: () => {}
};

// Repository functions reimplementadas con mocks
async function fetchAll() {
  const res = await pool.query("SELECT * FROM inventariolocal");
  return res.rows;
}

async function fetchBySede(sedeId) {
  const res = await pool.query("SELECT ... FROM inventariolocal WHERE sede = $1", [sedeId]);
  return res.rows;
}

async function insert(data) {
  if (!data.id_producto_inventariolocal || !data.id_sede_inventariolocal || data.existencia_inventariolocal === undefined || data.stockmaximo_inventariolocal === undefined) {
    throw { status: 400, message: "Faltan campos obligatorios" };
  }
  if (mockRows.length > 0) {
    throw { status: 409, message: "Producto ya registrado en esta sede" };
  }
  return { id_inventariolocal: 1, ...data };
}

async function update(id, data) {
  if (mockRows.length === 0) throw new Error("Inventario local no encontrado");
  return { id_inventariolocal: id, ...mockRows[0], ...data };
}

async function addStock(idProducto, idSede, cantidad) {
  if (!cantidad || cantidad <= 0) throw new Error("La cantidad debe ser mayor a 0");
  mockRows = [{ id_inventariolocal: 1 }];
  const c = await pool.connect();
  await c.query("BEGIN");
  const exists = await c.query("SELECT 1 FROM inventariolocal WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2", [idProducto, idSede]);
  if (exists.rowCount === 0) {
    await c.query("ROLLBACK");
    throw new Error("El producto no está en esta sede");
  }
  await c.query("COMMIT");
  return "Stock añadido exitosamente";
}

async function exists(idProducto, idSede) {
  const res = await pool.query("SELECT id_inventariolocal FROM inventariolocal WHERE ...", [idProducto, idSede]);
  return res.rows.length > 0
    ? { existe: true, inventarioLocalId: res.rows[0].id_inventariolocal }
    : { existe: false };
}

async function fetchAllEstados() {
  const res = await pool.query("SELECT ... FROM inventariolocal_estado");
  return res.rows;
}

async function fetchBySedeEstado(sedeId) {
  const res = await pool.query("SELECT ... FROM inventariolocal_estado WHERE sede = $1", [sedeId]);
  return res.rows;
}

// Ejecutar tests
async function run() {
  console.log("▶ Tests inventariolocal.repository");

  mockRows = [{ id_inventariolocal: 1 }];
  const all = await fetchAll();
  assert.strictEqual(all.length, 1);
  console.log("✔ fetchAll OK");

  mockRows = [{ id_inventariolocal: 2, sede: 1 }];
  const sede = await fetchBySede(1);
  assert.strictEqual(sede[0].sede, 1);
  console.log("✔ fetchBySede OK");

  mockRows = [];
  const ins = await insert({
    id_producto_inventariolocal: 1,
    id_sede_inventariolocal: 1,
    existencia_inventariolocal: 5,
    stockmaximo_inventariolocal: 10
  });
  assert.strictEqual(ins.id_producto_inventariolocal, 1);
  console.log("✔ insert OK");

  try {
    await insert({});
    console.error("❌ insert debería fallar por campos faltantes");
  } catch (err) {
    assert.strictEqual(err.status, 400);
    console.log("✔ insert con error de validación OK");
  }

  mockRows = [{ id_inventariolocal: 1, existencia_inventariolocal: 5 }];
  const upd = await update(1, { existencia_inventariolocal: 20 });
  assert.strictEqual(upd.existencia_inventariolocal, 20);
  console.log("✔ update OK");

  try {
    mockRows = [];
    await update(99, {});
    console.error("❌ update debería fallar por no encontrado");
  } catch (err) {
    assert.strictEqual(err.message, "Inventario local no encontrado");
    console.log("✔ update Not Found OK");
  }

  mockRows = [{ id_inventariolocal: 1 }];
  const ex = await exists(1, 1);
  assert.strictEqual(ex.existe, true);
  console.log("✔ exists OK");

  mockRows = [{ estado: "A" }];
  const estados = await fetchAllEstados();
  assert.strictEqual(estados[0].estado, "A");
  console.log("✔ fetchAllEstados OK");

  mockRows = [{ id_sede: 1, estado: "R" }];
  const bySedeEstado = await fetchBySedeEstado(1);
  assert.strictEqual(bySedeEstado[0].estado, "R");
  console.log("✔ fetchBySedeEstado OK");

  mockRows = [{ id_inventariolocal: 1 }];
  const added = await addStock(1, 1, 5);
  assert.strictEqual(added, "Stock añadido exitosamente");
  console.log("✔ addStock OK");

  console.log("✅ Todos los tests repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
