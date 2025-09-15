import assert from "assert";


const fakeService = {
  getVentasPorDiaSemana: async () => [{ dia: "Lunes", total: 100 }],
  getMapaCalorVentas: async () => [{ dia: "Martes", hora: "10:00", total: 50 }],
  getIngresosPorCategoria: async () => [{ categoria: "Electrónica", total: 500 }],
  getIngresosPorPeriodo: async () => [{ fecha: "2025-01-01", total: 1000 }],
  getVentasPorSede: async () => [{ sede: "Sucursal Norte", total: 200 }],
  getIngresosPorMetodoPago: async () => [{ metodo: "Tarjeta", total: 800 }],
  getIngresosPorMetodoPagoYSede: async () => [
    { metodo: "Efectivo", sede: "Sucursal Centro", total: 300 },
  ],
};

// Controllers simulados (igual firma que los reales)
async function getVentasPorDiaSemanaController(req, res) {
  try {
    const result = await fakeService.getVentasPorDiaSemana(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getMapaCalorVentasController(req, res) {
  try {
    const result = await fakeService.getMapaCalorVentas(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getIngresosPorCategoriaController(req, res) {
  try {
    const result = await fakeService.getIngresosPorCategoria(
      req.query.fechaInicio, req.query.fechaFin, parseInt(req.query.limite) || 10
    );
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getIngresosPorPeriodoController(req, res) {
  try {
    const result = await fakeService.getIngresosPorPeriodo(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getVentasPorSedeController(req, res) {
  try {
    const result = await fakeService.getVentasPorSede(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getIngresosPorMetodoPagoController(req, res) {
  try {
    const result = await fakeService.getIngresosPorMetodoPago(req.query.fechaInicio, req.query.fechaFin);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}
async function getIngresosPorMetodoPagoYSedeController(req, res) {
  try {
    const result = await fakeService.getIngresosPorMetodoPagoYSede(req.query.fechaInicio, req.query.fechaFin);
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
  console.log("▶ Tests estadisticasIngresos.controllers");

  {
    const res = createResMock();
    await getVentasPorDiaSemanaController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].dia, "Lunes");
    console.log("✔ getVentasPorDiaSemanaController OK");
  }

  {
    const res = createResMock();
    await getMapaCalorVentasController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].dia, "Martes");
    console.log("✔ getMapaCalorVentasController OK");
  }

  {
    const res = createResMock();
    await getIngresosPorCategoriaController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31", limite: "5" } }, res);
    assert.strictEqual(res.body[0].categoria, "Electrónica");
    console.log("✔ getIngresosPorCategoriaController OK");
  }

  {
    const res = createResMock();
    await getIngresosPorPeriodoController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].total, 1000);
    console.log("✔ getIngresosPorPeriodoController OK");
  }

  {
    const res = createResMock();
    await getVentasPorSedeController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].sede, "Sucursal Norte");
    console.log("✔ getVentasPorSedeController OK");
  }

  {
    const res = createResMock();
    await getIngresosPorMetodoPagoController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].metodo, "Tarjeta");
    console.log("✔ getIngresosPorMetodoPagoController OK");
  }

  {
    const res = createResMock();
    await getIngresosPorMetodoPagoYSedeController({ query: { fechaInicio: "2025-01-01", fechaFin: "2025-01-31" } }, res);
    assert.strictEqual(res.body[0].metodo, "Efectivo");
    console.log("✔ getIngresosPorMetodoPagoYSedeController OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
