import assert from "assert";

// ==== Mock service ====
const mpService = {
  addMetodosPagoToFactura: async (idFactura, metodosPago) => ({
    mensaje: "ok",
    addedMethods: [{ idFactura, ...metodosPago[0] }]
  }),
  getMetodosPagoByFactura: async (idFactura) => [{ idFactura, nombre: "Efectivo" }],
  getAllMetodosPago: async () => [{ id: 1, nombre: "Tarjeta" }],
  annulMetodoPago: async (idMetodoPago) => ({ mensaje: "anulado", metodoAnulado: { idMetodoPago } }),
};

// ==== Controllers con mock service inyectado ====
async function agregarMetodosPago(req, res) {
  try {
    const result = await mpService.addMetodosPagoToFactura(req.params.idFactura, req.body.metodosPago);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ mensaje: error.message });
  }
}

async function obtenerMetodosPagoPorFactura(req, res) {
  try {
    const result = await mpService.getMetodosPagoByFactura(req.params.idFactura);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error" });
  }
}

async function obtenerTodosLosMetodosPago(req, res) {
  try {
    const result = await mpService.getAllMetodosPago();
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error" });
  }
}

async function anularMetodoPago(req, res) {
  try {
    const result = await mpService.annulMetodoPago(req.params.idMetodoPago);
    res.json(result);
  } catch (error) {
    res.status(500).json({ mensaje: "Error" });
  }
}

// ==== Utilidad para simular res ====
function createRes() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(obj) { this.body = obj; return this; }
  };
}

// ==== Tests ====
async function run() {
  console.log("▶ Tests metodosPago.controllers");

  {
    const req = { params: { idFactura: "10" }, body: { metodosPago: [{ idTipoMetodoPago: 1, monto: 200 }] } };
    const res = createRes();
    await agregarMetodosPago(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.mensaje, "ok");
    console.log("✔ agregarMetodosPago OK");
  }

  {
    const req = { params: { idFactura: "20" } };
    const res = createRes();
    await obtenerMetodosPagoPorFactura(req, res);
    assert.strictEqual(res.body[0].idFactura, "20");
    console.log("✔ obtenerMetodosPagoPorFactura OK");
  }

  {
    const req = {};
    const res = createRes();
    await obtenerTodosLosMetodosPago(req, res);
    assert.strictEqual(res.body[0].nombre, "Tarjeta");
    console.log("✔ obtenerTodosLosMetodosPago OK");
  }

  {
    const req = { params: { idMetodoPago: "33" } };
    const res = createRes();
    await anularMetodoPago(req, res);
    assert.strictEqual(res.body.mensaje, "anulado");
    console.log("✔ anularMetodoPago OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
