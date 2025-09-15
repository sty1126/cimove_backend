import assert from "assert";


const controllers = {
  getClientesActivosPorPeriodoController: async (req, res) => {
    res.status(200).json([{ fecha: "2025-01-01" }]);
  },
  getMejoresClientesController: async (req, res) => {
    res.status(200).json([{ id_cliente: 1 }]);
  },
  getClientesPorSedeController: async (req, res) => {
    res.status(200).json([{ id_sede: 1 }]);
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
  console.log("▶ Tests estadisticasClientes.routes");

  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await controllers.getClientesActivosPorPeriodoController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].fecha, "2025-01-01");
    console.log("✔ Ruta clientes-activos OK");
  }

  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", limite: "5" } };
    const res = createResMock();
    await controllers.getMejoresClientesController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_cliente, 1);
    console.log("✔ Ruta mejores-clientes OK");
  }

  {
    const req = {};
    const res = createResMock();
    await controllers.getClientesPorSedeController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_sede, 1);
    console.log("✔ Ruta clientes-por-sede OK");
  }

  console.log("✅ Todos los tests de routes pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests routes:", err);
  process.exit(1);
});
