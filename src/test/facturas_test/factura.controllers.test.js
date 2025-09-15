// tests_manual/factura.controller.test.js
// Ejecutar: node tests_manual/factura.controller.test.js
import assert from "assert";

// ======================
// Fake service (mock)
// ======================
const facturaService = {
  createFactura: async () => ({ idFactura: 1, message: "ok" }),
  getFacturas: async () => [{ id_factura: 10 }],
  getFacturaById: async (id) => (id === 99 ? [] : [{ id_factura: id }]),
};

// ======================
// Controllers simulados
// ======================
async function createFacturaController(req, res) {
  try {
    const result = await facturaService.createFactura(req.body);
    res.status(201).json(result);
  } catch {
    res.status(500).json({ error: "Error registrando la factura" });
  }
}

async function getFacturasController(req, res) {
  try {
    const facturas = await facturaService.getFacturas();
    res.json(facturas);
  } catch {
    res.status(500).json({ error: "Error obteniendo facturas" });
  }
}

async function getFacturaByIdController(req, res) {
  try {
    const factura = await facturaService.getFacturaById(req.params.idFactura);
    if (factura.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.json(factura);
  } catch {
    res.status(500).json({ error: "Error obteniendo la factura" });
  }
}

// ======================
// Mock Express response
// ======================
function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) { this.statusCode = code; return this; };
  res.json = function (data) { this.body = data; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests factura.controller");

  // 1. Crear factura éxito
  {
    const res = createResMock();
    await createFacturaController({ body: { total: 100 } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.idFactura, 1);
    console.log("✔ createFacturaController OK");
  }

  // 2. Listar facturas
  {
    const res = createResMock();
    await getFacturasController({}, res);
    assert.ok(Array.isArray(res.body));
    console.log("✔ getFacturasController OK");
  }

  // 3. Obtener factura por ID (existe)
  {
    const res = createResMock();
    await getFacturaByIdController({ params: { idFactura: 10 } }, res);
    assert.strictEqual(res.body[0].id_factura, 10);
    console.log("✔ getFacturaByIdController existente OK");
  }

  // 4. Obtener factura por ID (no existe)
  {
    const res = createResMock();
    await getFacturaByIdController({ params: { idFactura: 99 } }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error, "Factura no encontrada");
    console.log("✔ getFacturaByIdController no encontrada OK");
  }

  console.log("✅ Todos los tests de factura.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
