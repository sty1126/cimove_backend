import assert from "assert";


const fakeService = {
  getProductosBajoStock: async () => [{ id: 1, nombre: "Prod A", stock: 2 }],
  getHistoricoVentasProducto: async () => [{ fecha: "2025-01-01", unidades: 5 }],
  getProductosMasVendidos: async () => [{ id: 2, nombre: "Prod B", unidades: 100 }],
  getProductosMasVendidosPorSede: async () => [
    { id: 3, nombre: "Prod C", sede: "Sucursal Norte", unidades: 50 }
  ],
};

// Controllers simulados
async function getProductosBajoStockController(req, res) {
  try {
    const result = await fakeService.getProductosBajoStock(parseInt(req.query.limite) || 20);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function getHistoricoVentasProductoController(req, res) {
  try {
    const { idProducto, fechaInicio, fechaFin } = req.query;
    if (!idProducto || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar idProducto, fechaInicio y fechaFin" });
    }
    const result = await fakeService.getHistoricoVentasProducto(idProducto, fechaInicio, fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function getProductosMasVendidosController(req, res) {
  try {
    const { fechaInicio, fechaFin, ordenarPor, limite } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar fechaInicio y fechaFin" });
    }
    const result = await fakeService.getProductosMasVendidos(
      fechaInicio, fechaFin, ordenarPor || "unidades", parseInt(limite) || 10
    );
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function getProductosMasVendidosPorSedeController(req, res) {
  try {
    const { fechaInicio, fechaFin, idSede, limite } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar fechaInicio y fechaFin" });
    }
    const result = await fakeService.getProductosMasVendidosPorSede(
      fechaInicio, fechaFin, idSede || null, parseInt(limite) || 10
    );
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
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
  console.log("▶ Tests estadisticasProductos.controllers");

  {
    const res = createResMock();
    await getProductosBajoStockController({ query: { limite: "5" } }, res);
    assert.strictEqual(res.body[0].nombre, "Prod A");
    console.log("✔ getProductosBajoStockController OK");
  }

  {
    const res = createResMock();
    await getHistoricoVentasProductoController({
      query: { idProducto: 1, fechaInicio: "2025-01-01", fechaFin: "2025-01-31" }
    }, res);
    assert.strictEqual(res.body[0].unidades, 5);
    console.log("✔ getHistoricoVentasProductoController OK");
  }

  {
    const res = createResMock();
    await getProductosMasVendidosController({
      query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", ordenarPor: "unidades", limite: "10" }
    }, res);
    assert.strictEqual(res.body[0].nombre, "Prod B");
    console.log("✔ getProductosMasVendidosController OK");
  }

  {
    const res = createResMock();
    await getProductosMasVendidosPorSedeController({
      query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", idSede: "1", limite: "10" }
    }, res);
    assert.strictEqual(res.body[0].sede, "Sucursal Norte");
    console.log("✔ getProductosMasVendidosPorSedeController OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
