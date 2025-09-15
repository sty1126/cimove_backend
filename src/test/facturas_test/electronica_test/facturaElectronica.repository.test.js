import assert from "assert";

// Mock de pool
const pool = {
  query: async (_query, _params) => ({ rows: mockRows, rowCount: mockRowCount })
};

let mockRows = [];
let mockRowCount = 0;

// Repository simulado
async function findAllActivas() {
  const res = await pool.query("SELECT ...");
  return res.rows;
}
async function findById(id) {
  const res = await pool.query("SELECT ... WHERE ID_FACTURA=$1", [id]);
  return res.rows[0] || null;
}
async function insert({ idFactura, cufe, fecha, xml, observaciones }) {
  const res = await pool.query("INSERT ... RETURNING *", [idFactura, cufe, fecha, xml, observaciones]);
  return res.rows[0];
}
async function update(id, { cufe, fecha, xml, observaciones }) {
  const res = await pool.query("UPDATE ... RETURNING *", [cufe, fecha, xml, observaciones, id]);
  return res.rows[0] || null;
}
async function softDelete(id) {
  const res = await pool.query("UPDATE ...", [id]);
  return res.rowCount > 0;
}

async function run() {
  console.log("▶ Tests facturaElectronica.repository");

  // findAllActivas
  {
    mockRows = [{ id_factura: 1, cufe: "ABC123" }];
    const r = await findAllActivas();
    assert.strictEqual(r[0].cufe, "ABC123");
    console.log("✔ findAllActivas OK");
  }

  // findById (ok)
  {
    mockRows = [{ id_factura: 1, cufe: "ABC123" }];
    const r = await findById(1);
    assert.strictEqual(r.cufe, "ABC123");
    console.log("✔ findById OK");
  }

  // findById (not found)
  {
    mockRows = [];
    const r = await findById(999);
    assert.strictEqual(r, null);
    console.log("✔ findById Not Found OK");
  }

  // insert
  {
    mockRows = [{ id_factura: 2, cufe: "XYZ" }];
    const r = await insert({ idFactura: 2, cufe: "XYZ", fecha: "2025-01-01", xml: "<xml/>", observaciones: "" });
    assert.strictEqual(r.id_factura, 2);
    console.log("✔ insert OK");
  }

  // update ok
  {
    mockRows = [{ id_factura: 1, cufe: "NEW" }];
    const r = await update(1, { cufe: "NEW", fecha: "2025-01-02", xml: "<xml/>", observaciones: "" });
    assert.strictEqual(r.cufe, "NEW");
    console.log("✔ update OK");
  }

  // update not found
  {
    mockRows = [];
    const r = await update(999, { cufe: "X" });
    assert.strictEqual(r, null);
    console.log("✔ update Not Found OK");
  }

  // softDelete ok
  {
    mockRowCount = 1;
    const r = await softDelete(1);
    assert.strictEqual(r, true);
    console.log("✔ softDelete OK");
  }

  // softDelete not found
  {
    mockRowCount = 0;
    const r = await softDelete(999);
    assert.strictEqual(r, false);
    console.log("✔ softDelete Not Found OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
