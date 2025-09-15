// tests_manual/factura.service.test.js
// Ejecutar: node tests_manual/factura.service.test.js
import assert from "assert";

// ======================
// Fake repo y pool
// ======================
function createClientMock() {
  return {
    calls: [],
    async query(sql) { this.calls.push(sql); return { rows: [] }; },
    release() { this.calls.push("release"); }
  };
}

const facturaRepo = {
  insertFactura: async () => 123,
  insertDetalleFactura: async () => {},
  updateInventarioLocal: async () => {},
  insertMetodoPago: async () => {},
};

// ======================
// Service simulado
// ======================
async function createFactura(facturaData) {
  const client = createClientMock();
  await client.query("BEGIN");

  try {
    const idFactura = await facturaRepo.insertFactura(client, facturaData);

    for (const d of facturaData.detalles) {
      if (!d.idSede) throw new Error("Falta idSede en el detalle de factura");
      await facturaRepo.insertDetalleFactura(client, idFactura, d);
      await facturaRepo.updateInventarioLocal(client, d.idProducto, d.idSede, d.cantidad);
    }

    for (const m of facturaData.metodosPago || []) {
      if (!m.idTipoMetodoPago || m.monto == null) throw new Error("Método de pago inválido");
      await facturaRepo.insertMetodoPago(client, idFactura, m);
    }

    await client.query("COMMIT");
    client.release();
    return { message: "Factura registrada con éxito", idFactura };
  } catch (err) {
    await client.query("ROLLBACK");
    client.release();
    throw err;
  }
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests factura.service");

  // 1. Caso éxito
  {
    const data = {
      detalles: [{ idProducto: 1, cantidad: 2, idSede: 1 }],
      metodosPago: [{ idTipoMetodoPago: 1, monto: 100 }],
    };
    const result = await createFactura(data);
    assert.strictEqual(result.idFactura, 123);
    console.log("✔ createFactura éxito OK");
  }

  // 2. Falla por falta de idSede
  {
    const data = { detalles: [{ idProducto: 1, cantidad: 1 }] };
    try {
      await createFactura(data);
      console.error("❌ FAIL: no lanzó error por falta idSede");
    } catch (e) {
      assert.ok(String(e).includes("Falta idSede"));
      console.log("✔ createFactura falta idSede OK");
    }
  }

  // 3. Falla por método de pago inválido
  {
    const data = {
      detalles: [{ idProducto: 1, cantidad: 1, idSede: 1 }],
      metodosPago: [{ idTipoMetodoPago: null, monto: null }],
    };
    try {
      await createFactura(data);
      console.error("❌ FAIL: no lanzó error por metodoPago inválido");
    } catch (e) {
      assert.ok(String(e).includes("Método de pago inválido"));
      console.log("✔ createFactura metodoPago inválido OK");
    }
  }

  console.log("✅ Todos los tests de factura.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
