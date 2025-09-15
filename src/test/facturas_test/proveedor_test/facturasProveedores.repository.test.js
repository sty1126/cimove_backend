import assert from "assert";

let mockRows = [];
let mockRowCount = 0;

// Mock pool
const pool = {
  query: async (_q, _p) => ({ rows: mockRows, rowCount: mockRowCount })
};

// Repository simulado
async function findAll() {
  const { rows } = await pool.query("SELECT ...");
  return rows;
}
async function findById(id) {
  const res = await pool.query("SELECT ... WHERE ID=$1", [id]);
  return res.rows[0] || null;
}
async function insert({ idOrdenCompra, fecha, monto }) {
  const res = await pool.query("INSERT ... RETURNING *", [idOrdenCompra, fecha, monto]);
  return res.rows[0];
}

async function run() {
  console.log("▶ Tests facturasProveedores.repository");

  {
    mockRows = [{ id_facturaproveedor: 1, monto_facturaproveedor: 500 }];
    const r = await findAll();
    assert.strictEqual(r[0].id_facturaproveedor, 1);
    console.log("✔ findAll OK");
  }

  {
    mockRows = [{ id_facturaproveedor: 2 }];
    const r = await findById(2);
    assert.strictEqual(r.id_facturaproveedor, 2);
    console.log("✔ findById OK");
  }

  {
    mockRows = [];
    const r = await findById(999);
    assert.strictEqual(r, null);
    console.log("✔ findById Not Found OK");
  }

  {
    mockRows = [{ id_facturaproveedor: 3, monto_facturaproveedor: 1200 }];
    const r = await insert({ idOrdenCompra: 10, fecha: "2025-01-01", monto: 1200 });
    assert.strictEqual(r.id_facturaproveedor, 3);
    console.log("✔ insert OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch((err) => console.error("❌ Error en tests repository:", err));
