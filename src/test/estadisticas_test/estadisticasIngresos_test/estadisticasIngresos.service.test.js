import assert from "assert";


const repo = {
  obtenerVentasPorDiaSemana: async () => [{ dia: "Lunes", total: 100 }],
  obtenerMapaCalorVentas: async () => [{ dia: "Martes", hora: "10:00", total: 50 }],
  obtenerIngresosPorCategoria: async () => [{ categoria: "Electrónica", total: 500 }],
  obtenerIngresosPorPeriodo: async () => [{ fecha: "2025-01-01", total: 1000 }],
  obtenerVentasPorSede: async () => [{ sede: "Sucursal Norte", total: 200 }],
  obtenerIngresosPorMetodoPago: async () => [{ metodo: "Tarjeta", total: 800 }],
  obtenerIngresosPorMetodoPagoYSede: async () => [
    { metodo: "Efectivo", sede: "Sucursal Centro", total: 300 },
  ],
};

// Service simulado
function getVentasPorDiaSemana(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerVentasPorDiaSemana(fi, ff);
}
function getMapaCalorVentas(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerMapaCalorVentas(fi, ff);
}
function getIngresosPorCategoria(fi, ff, lim = 10) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerIngresosPorCategoria(fi, ff, lim);
}
function getIngresosPorPeriodo(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerIngresosPorPeriodo(fi, ff);
}
function getVentasPorSede(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerVentasPorSede(fi, ff);
}
function getIngresosPorMetodoPago(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerIngresosPorMetodoPago(fi, ff);
}
function getIngresosPorMetodoPagoYSede(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerIngresosPorMetodoPagoYSede(fi, ff);
}

async function run() {
  console.log("▶ Tests estadisticasIngresos.service");

  {
    let err = null;
    try { getVentasPorDiaSemana(null, "2025-01-31"); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getVentasPorDiaSemana error validado");
  }

  {
    const r = await getIngresosPorPeriodo("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].total, 1000);
    console.log("✔ getIngresosPorPeriodo OK");
  }

  {
    const r = await getMapaCalorVentas("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].dia, "Martes");
    console.log("✔ getMapaCalorVentas OK");
  }

  {
    const r = await getIngresosPorCategoria("2025-01-01", "2025-01-31", 5);
    assert.strictEqual(r[0].categoria, "Electrónica");
    console.log("✔ getIngresosPorCategoria OK");
  }

  {
    const r = await getVentasPorSede("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].sede, "Sucursal Norte");
    console.log("✔ getVentasPorSede OK");
  }

  {
    const r = await getIngresosPorMetodoPago("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].metodo, "Tarjeta");
    console.log("✔ getIngresosPorMetodoPago OK");
  }

  {
    const r = await getIngresosPorMetodoPagoYSede("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].sede, "Sucursal Centro");
    console.log("✔ getIngresosPorMetodoPagoYSede OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests service:", err);
  process.exit(1);
});
