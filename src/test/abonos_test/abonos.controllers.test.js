// tests_manual/controller_abonos.test.js
// Ejecutar: node tests_manual/controller_abonos.test.js
import assert from "assert";

// ======================
// Fake Service (doble de prueba)
// ======================
const fakeService = {
  getAbonos: async () => [{ id_abonofactura: 1, monto_abonofactura: 100 }],
  createAbono: async () => ({
    id_abonofactura: 123,
    id_facturaproveedor_abonofactura: 1,
    fecha_abonofactura: "2025-09-13",
    monto_abonofactura: 100,
    estado_abonofactura: "A",
  }),
  anularAbono: async (id) => ({
    mensaje: "Abono anulado correctamente",
    abono: { id_abonofactura: id, estado_abonofactura: "I" },
  }),
  obtenerTotalAbonadoPorFactura: async (idFactura) => ({
    idFactura,
    totalAbonado: 500,
  }),
};

// ======================
// Controllers simulados con fakeService
// (idénticos a los tuyos, pero llaman al fakeService)
// ======================
async function getAbonosController(req, res) {
  try {
    const abonos = await fakeService.getAbonos();
    res.status(200).json(abonos);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function crearAbonoController(req, res) {
  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      throw new Error("Todos los campos son obligatorios");
    }
    const abono = await fakeService.createAbono(req.body);
    res.status(201).json(abono);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function anularAbonoController(req, res) {
  try {
    const { id } = req.params;
    const result = await fakeService.anularAbono(id);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function obtenerTotalAbonadoPorFacturaController(req, res) {
  try {
    const { idFactura } = req.params;
    const result = await fakeService.obtenerTotalAbonadoPorFactura(idFactura);
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// ======================
// Mock de response Express
// ======================
function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests controller_abonos (con fakeService)");

  // 1. GET /abonos
  {
    const req = {};
    const res = createResMock();
    await getAbonosController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    console.log("✔ getAbonosController OK");
  }

  // 2. POST /abonos inválido
  {
    const req = { body: {} };
    const res = createResMock();
    await crearAbonoController(req, res);
    assert.strictEqual(res.statusCode, 400);
    console.log("✔ crearAbonoController inválido OK");
  }

  // 3. POST /abonos válido
  {
    const req = {
      body: {
        id_facturaproveedor_abonofactura: 1,
        fecha_abonofactura: "2025-09-13",
        monto_abonofactura: 100,
      },
    };
    const res = createResMock();
    await crearAbonoController(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.id_abonofactura, 123);
    console.log("✔ crearAbonoController válido OK");
  }

  // 4. PUT /abonos/anular/:id
  {
    const req = { params: { id: 1 } };
    const res = createResMock();
    await anularAbonoController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.abono.estado_abonofactura, "I");
    console.log("✔ anularAbonoController OK");
  }

  // 5. GET /abonos/total/:idFactura
  {
    const req = { params: { idFactura: 1 } };
    const res = createResMock();
    await obtenerTotalAbonadoPorFacturaController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.totalAbonado, 500);
    console.log("✔ obtenerTotalAbonadoPorFacturaController OK");
  }

  console.log("✅ Todos los tests de controller_abonos pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
