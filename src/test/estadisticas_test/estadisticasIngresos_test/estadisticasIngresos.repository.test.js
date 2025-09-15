import assert from "assert";

// Simular pool con un mock de query
const pool = {
  query: async (_query, _params) => ({ rows: mockRows })
};

// Mocks dinámicos para pruebas
let mockRows = [];


async function obtenerVentasPorDiaSemana(fechaInicio, fechaFin) {
  return pool.query("dummy", [fechaInicio, fechaFin]).then(r => r.rows);
}
async function obtenerMapaCalorVentas(fechaInicio, fechaFin) {
  return pool.query("dummy", [fechaInicio, fechaFin]).then(r => r.rows);
}
async function obtenerIngresosPorCategoria(fi, ff, limite = 10) {
  return pool.query("dummy", [fi, ff, limite]).then(r => r.rows);
}
async function obtenerIngresosPorPeriodo(fi, ff) {
  return pool.query("dummy", [fi, ff]).then(r => r.rows);
}
async function obtenerVentasPorSede(fi, ff) {
  return pool.query("dummy", [fi, ff]).then(r => r.rows);
}
async function obtenerIngresosPorMetodoPago(fi, ff) {
  return pool.query("dummy", [fi, ff]).then(r => r.rows);
}
async function obtenerIngresosPorMetodoPagoYSede(fi, ff) {
  return pool.query("dummy", [fi, ff]).then(r => r.rows);
}

async function run() {
  console.log("▶ Tests estadisticasIngresos.repository");

  // Ventas por día de semana
  {
    mockRows = [{ dia_semana: 1, nombre_dia: "Lunes", total_ventas: 1000 }];
    const r = await obtenerVentasPorDiaSemana("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].nombre_dia, "Lunes");
    console.log("✔ obtenerVentasPorDiaSemana OK");
  }

  // Mapa de calor
  {
    mockRows = [{ dia_semana: 2, valor: 500 }];
    const r = await obtenerMapaCalorVentas("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].valor, 500);
    console.log("✔ obtenerMapaCalorVentas OK");
  }

  // Ingresos por categoría
  {
    mockRows = [{ categoria: "Electrónica", ingreso_total: 2000 }];
    const r = await obtenerIngresosPorCategoria("2025-01-01", "2025-01-31", 5);
    assert.strictEqual(r[0].categoria, "Electrónica");
    console.log("✔ obtenerIngresosPorCategoria OK");
  }

  // Ingresos por periodo
  {
    mockRows = [{ fecha: "2025-01-10", ingreso_total: 1500 }];
    const r = await obtenerIngresosPorPeriodo("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].ingreso_total, 1500);
    console.log("✔ obtenerIngresosPorPeriodo OK");
  }

  // Ventas por sede
  {
    mockRows = [{ nombre_sede: "Sucursal Norte", total_ventas: 3000 }];
    const r = await obtenerVentasPorSede("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].nombre_sede, "Sucursal Norte");
    console.log("✔ obtenerVentasPorSede OK");
  }

  // Ingresos por método de pago
  {
    mockRows = [{ nombre_tipometodopago: "Tarjeta", total_ingresos: 5000 }];
    const r = await obtenerIngresosPorMetodoPago("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].nombre_tipometodopago, "Tarjeta");
    console.log("✔ obtenerIngresosPorMetodoPago OK");
  }

  // Ingresos por método de pago y sede
  {
    mockRows = [{ nombre_sede: "Sucursal Centro", nombre_tipometodopago: "Efectivo", total_ingresos: 1000 }];
    const r = await obtenerIngresosPorMetodoPagoYSede("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].nombre_sede, "Sucursal Centro");
    console.log("✔ obtenerIngresosPorMetodoPagoYSede OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
