import assert from "assert";

// Fake controllers
const controllers = {
  getEgresosPorPeriodoController: async (req, res) => {
    res.status(200).json([{ fecha: "2025-01-01", egreso_total: 100 }]);
  },
  getPrincipalesEgresosController: async (req, res) => {
    res.status(200).json([{ id_proveedor: 1, egreso_total: 500 }]);
  },
};

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
  console.log("▶ Tests estadisticasEgresos.routes");

  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await controllers.getEgresosPorPeriodoController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].egreso_total, 100);
    console.log("✔ Ruta egresos OK");
  }

  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", limite: "5" } };
    const res = createResMock();
    await controllers.getPrincipalesEgresosController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_proveedor, 1);
    console.log("✔ Ruta principales-egresos OK");
  }

  console.log("✅ Todos los tests de routes pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests routes:", err);
  process.exit(1);
});
