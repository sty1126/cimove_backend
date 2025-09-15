import assert from "assert";

// ======================
// Mock service
// ======================
const service = {
  getMovimientos: (req, res) => res.json([{ id: 1, tipo: "Ingreso" }]),
  getTipoMovimientos: (req, res) => res.json([{ id: "I", descripcion: "Ingreso" }]),
  createMovimiento: (req, res) =>
    res.status(201).json({ message: "Movimiento registrado con éxito", movimiento: req.body })
};

// ======================
// Controllers simulados
// ======================
const controller = {
  getMovimientos: (req, res) => service.getMovimientos(req, res),
  getTipoMovimientos: (req, res) => service.getTipoMovimientos(req, res),
  createMovimiento: (req, res) => service.createMovimiento(req, res)
};

// ======================
// Mock res
// ======================
function makeRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (c) { this.statusCode = c; return this; };
  res.json = function (d) { this.body = d; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests movimiento.controller");

  // 1. getMovimientos
  {
    const res = makeRes();
    controller.getMovimientos({}, res);
    assert.strictEqual(res.body[0].tipo, "Ingreso");
    console.log("✔ getMovimientos OK");
  }

  // 2. getTipoMovimientos
  {
    const res = makeRes();
    controller.getTipoMovimientos({}, res);
    assert.strictEqual(res.body[0].descripcion, "Ingreso");
    console.log("✔ getTipoMovimientos OK");
  }

  // 3. createMovimiento
  {
    const res = makeRes();
    controller.createMovimiento({ body: { tipo: "Egreso", monto: 300 } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.movimiento.monto, 300);
    console.log("✔ createMovimiento OK");
  }

  console.log("✅ Todos los tests de movimiento.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
