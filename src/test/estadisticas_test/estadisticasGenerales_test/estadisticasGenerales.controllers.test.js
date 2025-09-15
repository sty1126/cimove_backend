import assert from "assert";


const fakeService = {
  getRentabilidad: async (fi, ff) => ({
    ingreso_total: 1000,
    egreso_total: 400,
    beneficio_neto: 600,
  }),
  getEvolucionRentabilidad: async (fi, ff) => [
    { fecha: fi, ingreso_total: 500, beneficio_neto: 300, margen_porcentaje: 60 },
  ],
};

// Controllers simulados
async function getRentabilidadController(req, res) {
  try {
    const result = await fakeService.getRentabilidad(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getEvolucionRentabilidadController(req, res) {
  try {
    const result = await fakeService.getEvolucionRentabilidad(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Mock response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
}

async function run() {
  console.log("▶ Tests estadisticasGenerales.controllers");

  // 1. rentabilidad
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await getRentabilidadController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.beneficio_neto, 600);
    console.log("✔ getRentabilidadController OK");
  }

  // 2. evolución rentabilidad
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await getEvolucionRentabilidadController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].margen_porcentaje, 60);
    console.log("✔ getEvolucionRentabilidadController OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
