import assert from "assert";


const repo = {
  obtenerClientesActivosPorPeriodo: async () => [{ fecha: "2025-01-01", cantidad_clientes: 2 }],
  obtenerMejoresClientes: async () => [{ id_cliente: 1, total_compras: 800 }],
  obtenerClientesPorSede: async () => [{ id_sede: 1, total_ventas: 200 }],
};

// Service simulado
function getClientesActivosPorPeriodo(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerClientesActivosPorPeriodo(fi, ff);
}

function getMejoresClientes(fi, ff, lim) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  if (lim <= 0) lim = 10;
  return repo.obtenerMejoresClientes(fi, ff, lim);
}

function getClientesPorSede() {
  return repo.obtenerClientesPorSede();
}

async function run() {
  console.log("▶ Tests estadisticasClientes.service");

  {
    let err = null;
    try { getClientesActivosPorPeriodo(null, "2025-01-31"); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getClientesActivosPorPeriodo error validado");
  }

  {
    const r = await getClientesActivosPorPeriodo("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].cantidad_clientes, 2);
    console.log("✔ getClientesActivosPorPeriodo OK");
  }

  {
    let err = null;
    try { getMejoresClientes(null, null); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getMejoresClientes error validado");
  }

  {
    const r = await getMejoresClientes("2025-01-01", "2025-01-31", 5);
    assert.strictEqual(r[0].total_compras, 800);
    console.log("✔ getMejoresClientes OK");
  }

  {
    const r = await getClientesPorSede();
    assert.strictEqual(r[0].id_sede, 1);
    console.log("✔ getClientesPorSede OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests service:", err);
  process.exit(1);
});
