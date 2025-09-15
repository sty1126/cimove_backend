import assert from "assert";

// ======================
// Fake client
// ======================
function createClientMock() {
  return {
    lastQuery: null,
    async query(text, values) {
      this.lastQuery = { text, values };
      return { rows: [{ id_factura: 42 }] };
    },
  };
}

// ======================
// Repository simulado
// ======================
async function insertFactura(client, data) {
  const sql = `INSERT INTO FACTURA (...) VALUES (...) RETURNING id_factura`;
  const values = [data.fecha, data.idCliente || null, data.total];
  const result = await client.query(sql, values);
  return result.rows[0].id_factura;
}

async function insertDetalleFactura(client, idFactura, d) {
  const sql = `INSERT INTO DETALLEFACTURA (...) VALUES (...)`;
  const values = [idFactura, d.idProducto, d.cantidad, d.precioVenta, d.valorIVA];
  await client.query(sql, values);
}

async function updateInventarioLocal(client, idProducto, idSede, cantidad) {
  const sql = `UPDATE INVENTARIOLOCAL SET EXISTENCIA = EXISTENCIA - $1 WHERE ID_PRODUCTO = $2 AND ID_SEDE = $3`;
  const values = [cantidad, idProducto, idSede];
  await client.query(sql, values);
}

async function insertMetodoPago(client, idFactura, m) {
  const sql = `INSERT INTO METODOPAGO (...) VALUES (...)`;
  const values = [idFactura, m.idTipoMetodoPago, m.monto];
  await client.query(sql, values);
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests factura.repository");

  const client = createClientMock();

  // insertFactura
  const id = await insertFactura(client, { fecha: "2025-01-01", total: 100 });
  assert.strictEqual(id, 42);
  console.log("✔ insertFactura OK");

  // insertDetalleFactura
  await insertDetalleFactura(client, 1, { idProducto: 2, cantidad: 3, precioVenta: 50, valorIVA: 10 });
  assert.deepStrictEqual(client.lastQuery.values, [1, 2, 3, 50, 10]);
  console.log("✔ insertDetalleFactura OK");

  // updateInventarioLocal
  await updateInventarioLocal(client, 5, 9, 2);
  assert.deepStrictEqual(client.lastQuery.values, [2, 5, 9]);
  console.log("✔ updateInventarioLocal OK");

  // insertMetodoPago
  await insertMetodoPago(client, 7, { idTipoMetodoPago: 3, monto: 500 });
  assert.deepStrictEqual(client.lastQuery.values, [7, 3, 500]);
  console.log("✔ insertMetodoPago OK");

  console.log("✅ Todos los tests de factura.repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
