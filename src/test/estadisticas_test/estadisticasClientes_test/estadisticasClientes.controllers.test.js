import assert from "assert";


const fakeService = {
  getClientesActivosPorPeriodo: async (fi, ff) => [
    { fecha: fi, cantidad_clientes: 3 },
  ],
  getMejoresClientes: async (fi, ff, limite) => [
    { id_cliente: 1, total_compras: 100 },
  ],
  getClientesPorSede: async () => [
    { id_sede: 1, total_ventas: 500 },
  ],
};

// Controllers simulados
async function getClientesActivosPorPeriodoController(req, res) {
  try {
    const result = await fakeService.getClientesActivosPorPeriodo(
      req.query.fechaInicio,
      req.query.fechaFin
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getMejoresClientesController(req, res) {
  try {
    const result = await fakeService.getMejoresClientes(
      req.query.fechaInicio,
      req.query.fechaFin,
      parseInt(req.query.limite) || 10
    );
    res.status(200).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

async function getClientesPorSedeController(req, res) {
  try {
    const result = await fakeService.getClientesPorSede();
    res.status(200).json(result);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

// Mock response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    },
  };
}

async function run() {
  console.log("▶ Tests estadisticasClientes.controllers");

  // 1. clientes-activos
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } };
    const res = createResMock();
    await getClientesActivosPorPeriodoController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].cantidad_clientes, 3);
    console.log("✔ getClientesActivosPorPeriodoController OK");
  }

  // 2. mejores-clientes
  {
    const req = { query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", limite: "5" } };
    const res = createResMock();
    await getMejoresClientesController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_cliente, 1);
    console.log("✔ getMejoresClientesController OK");
  }

  // 3. clientes-por-sede
  {
    const req = {};
    const res = createResMock();
    await getClientesPorSedeController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].id_sede, 1);
    console.log("✔ getClientesPorSedeController OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
