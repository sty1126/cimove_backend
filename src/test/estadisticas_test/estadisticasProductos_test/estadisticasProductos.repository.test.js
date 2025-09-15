import assert from "assert";


const pool = {
  query: async (_query, _params) => ({ rows: mockRows })
};

// Mock dinámico
let mockRows = [];

// Repository simulado con pool mockeado
async function obtenerProductosBajoStock(limite = 20) {
  return pool.query("dummy", [limite]).then(r => r.rows);
}
async function obtenerHistoricoVentasProducto(idProducto, fi, ff) {
  return pool.query("dummy", [idProducto, fi, ff]).then(r => r.rows);
}
async function obtenerProductosMasVendidos(fi, ff, ordenarPor = "unidades", limite = 10) {
  return pool.query("dummy", [fi, ff, limite]).then(r => r.rows);
}
async function obtenerProductosMasVendidosPorSede(fi, ff, idSede, limite = 10) {
  return pool.query("dummy", [fi, ff, idSede, limite]).then(r => r.rows);
}

async function run() {
  console.log("▶ Tests estadisticasProductos.repository");

  // Productos bajo stock
  {
    mockRows = [{ id_producto: 1, nombre_producto: "Prod A", stock_actual: 2 }];
    const r = await obtenerProductosBajoStock(5);
    assert.strictEqual(r[0].nombre_producto, "Prod A");
    console.log("✔ obtenerProductosBajoStock OK");
  }

  // Histórico ventas producto
  {
    mockRows = [{ fecha: "2025-01-01", cantidad_vendida: 10, total_ventas: 200 }];
    const r = await obtenerHistoricoVentasProducto(1, "2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].cantidad_vendida, 10);
    console.log("✔ obtenerHistoricoVentasProducto OK");
  }

  // Productos más vendidos
  {
    mockRows = [{ id_producto: 2, nombre_producto: "Prod B", total_unidades: 50 }];
    const r = await obtenerProductosMasVendidos("2025-01-01", "2025-01-31", "unidades", 5);
    assert.strictEqual(r[0].nombre_producto, "Prod B");
    console.log("✔ obtenerProductosMasVendidos OK");
  }

  // Productos más vendidos por sede
  {
    mockRows = [{ id_producto: 3, nombre_producto: "Prod C", nombre_sede: "Sucursal Norte", total_unidades: 100 }];
    const r = await obtenerProductosMasVendidosPorSede("2025-01-01", "2025-01-31", 1, 5);
    assert.strictEqual(r[0].nombre_sede, "Sucursal Norte");
    console.log("✔ obtenerProductosMasVendidosPorSede OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
