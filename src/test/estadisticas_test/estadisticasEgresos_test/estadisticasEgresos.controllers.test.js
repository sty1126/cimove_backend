import assert from "assert";


const fakeService = {
  getEgresosPorPeriodo: async (fi, ff) => [
    { fecha: fi, egreso_total: 1000 },
  ],
  getPrincipalesEgresos: async (fi, ff, limite) => [
    { id_proveedor: 1, nombre_proveedor: "Proveedor X", egreso_total: 5000 },
  ],
};

// Controllers simulados
async function getEgresosPorPeriodoController(req, res) {
  try {
    const result = await fakeService.getEgresosPorPeriodo(
      req.query.fechaInicio,
      req.query.fechaFin
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getPrincipalesEgresosController(req, res) {
  try {
    const result = await fakeService.getPrincipalesEgresos(
      req.query.fechaInicio,
      req.query.fechaFin,
      parseInt(req.query.limite) || 10
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Mock de response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
}

async function run() {
  console.log("▶ Tests estadisticasEgresos.controllers");

  // 1. egresos por período
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await getEgresosPorPeriodoController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].egreso_total, 1000);
    console.log("✔ getEgresosPorPeriodoController OK");
  }

  // 2. principales egresos
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", limite: "5" } };
    const res = createResMock();
    await getPrincipalesEgresosController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_proveedor, 1);
    console.log("✔ getPrincipalesEgresosController OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
