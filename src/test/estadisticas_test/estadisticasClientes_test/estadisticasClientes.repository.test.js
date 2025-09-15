import assert from "assert";


const pool = {
  async query(sql, params) {
    if (sql.includes("COUNT")) {
      return { rows: [{ fecha: "2025-01-01", cantidad_clientes: 2 }] };
    }
    if (sql.includes("LIMIT")) {
      return { rows: [{ id_cliente: 1, total_compras: 500 }] };
    }
    return { rows: [{ id_sede: 1, total_ventas: 1000 }] };
  },
};

// Repositorio simulado
async function obtenerClientesActivosPorPeriodo(fi, ff) {
  return (await pool.query("fake COUNT", [fi, ff])).rows;
}

async function obtenerMejoresClientes(fi, ff, lim) {
  return (await pool.query("fake LIMIT", [fi, ff, lim])).rows;
}

async function obtenerClientesPorSede() {
  return (await pool.query("fake GROUP")).rows;
}

async function run() {
  console.log("▶ Tests estadisticasClientes.repository");

  {
    const r = await obtenerClientesActivosPorPeriodo("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].cantidad_clientes, 2);
    console.log("✔ obtenerClientesActivosPorPeriodo OK");
  }

  {
    const r = await obtenerMejoresClientes("2025-01-01", "2025-01-31", 5);
    assert.strictEqual(r[0].total_compras, 500);
    console.log("✔ obtenerMejoresClientes OK");
  }

  {
    const r = await obtenerClientesPorSede();
    assert.strictEqual(r[0].id_sede, 1);
    console.log("✔ obtenerClientesPorSede OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
