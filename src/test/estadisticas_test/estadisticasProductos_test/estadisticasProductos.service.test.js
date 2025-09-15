import assert from "assert";


const repo = {
  obtenerProductosBajoStock: async () => [{ id: 1, nombre: "Prod A", stock: 2 }],
  obtenerHistoricoVentasProducto: async () => [{ fecha: "2025-01-01", unidades: 5 }],
  obtenerProductosMasVendidos: async () => [{ id: 2, nombre: "Prod B", unidades: 100 }],
  obtenerProductosMasVendidosPorSede: async () => [
    { id: 3, nombre: "Prod C", sede: "Sucursal Norte", unidades: 50 }
  ],
};

// Service simulado
function getProductosBajoStock(limite = 20) {
  return repo.obtenerProductosBajoStock(limite);
}
function getHistoricoVentasProducto(idProducto, fi, ff) {
  if (!idProducto || !fi || !ff) throw new Error("Debe especificar idProducto, fechaInicio y fechaFin");
  return repo.obtenerHistoricoVentasProducto(idProducto, fi, ff);
}
function getProductosMasVendidos(fi, ff, ordenarPor = "unidades", limite = 10) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerProductosMasVendidos(fi, ff, ordenarPor, limite);
}
function getProductosMasVendidosPorSede(fi, ff, idSede = null, limite = 10) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerProductosMasVendidosPorSede(fi, ff, idSede, limite);
}

async function run() {
  console.log("▶ Tests estadisticasProductos.service");

  {
    const r = await getProductosBajoStock(5);
    assert.strictEqual(r[0].stock, 2);
    console.log("✔ getProductosBajoStock OK");
  }

  {
    let err = null;
    try { getHistoricoVentasProducto(null, "2025-01-01", "2025-01-31"); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si falta idProducto");
    console.log("✔ getHistoricoVentasProducto validación OK");
  }

  {
    const r = await getProductosMasVendidos("2025-01-01", "2025-01-31", "unidades", 10);
    assert.strictEqual(r[0].nombre, "Prod B");
    console.log("✔ getProductosMasVendidos OK");
  }

  {
    const r = await getProductosMasVendidosPorSede("2025-01-01", "2025-01-31", 1, 5);
    assert.strictEqual(r[0].sede, "Sucursal Norte");
    console.log("✔ getProductosMasVendidosPorSede OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests service:", err);
  process.exit(1);
});
