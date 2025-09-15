
import assert from "assert";
import router from "../../modules/auditoria/auditoria.routes.js";


// controller para probar

let lastCall = null;
function fakeController(req, res) {
  lastCall = { path: req.path, params: req.params, query: req.query };
  res.json({ ok: true, ...lastCall });
}

// Reemplazar todos los handlers con el controller de prueba
router.stack.forEach((layer) => {
  layer.route.stack.forEach((r) => {
    r.handle = fakeController;
  });
});

// ======================
// Helpers para simular req/res
// ======================
function createMockRes() {
  return {
    data: null,
    json(payload) {
      this.data = payload;
    },
  };
}

async function simulateRoute(path, method = "get", params = {}, query = {}) {
  const layer = router.stack.find(
    (l) => l.route?.path === path && l.route.methods[method]
  );
  if (!layer) throw new Error(`Ruta no encontrada: ${method.toUpperCase()} ${path}`);

  const req = { path, params, query };
  const res = createMockRes();
  await layer.route.stack[0].handle(req, res);
  return res.data;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests auditoria.routes");

  // 1. GET /
  {
    const result = await simulateRoute("/");
    assert.strictEqual(result.path, "/");
    console.log("✔ GET / OK");
  }

  // 2. GET /usuario/:idUsuario
  {
    const result = await simulateRoute("/usuario/:idUsuario", "get", { idUsuario: "7" });
    assert.strictEqual(result.params.idUsuario, "7");
    console.log("✔ GET /usuario/:idUsuario OK");
  }

  // 3. GET /tipomov/:idTipoMov
  {
    const result = await simulateRoute("/tipomov/:idTipoMov", "get", { idTipoMov: "3" });
    assert.strictEqual(result.params.idTipoMov, "3");
    console.log("✔ GET /tipomov/:idTipoMov OK");
  }

  // 4. GET /fechas con query params
  {
    const result = await simulateRoute("/fechas", "get", {}, { fechaInicio: "2025-01-01", fechaFin: "2025-09-01" });
    assert.strictEqual(result.query.fechaInicio, "2025-01-01");
    assert.strictEqual(result.query.fechaFin, "2025-09-01");
    console.log("✔ GET /fechas OK");
  }

  console.log("✅ Todos los tests de auditoria.routes pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
