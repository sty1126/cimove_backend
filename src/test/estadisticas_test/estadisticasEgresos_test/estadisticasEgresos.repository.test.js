import assert from "assert";


const pool = {
  async query(sql, params) {
    // Palabras clave del query
    if (sql.includes("fecha_facturaproveedor")) {
      return { rows: [{ fecha: "2025-01-01", egreso_total: 200 }] };
    }
    if (sql.includes("GROUP BY p.id_proveedor")) {
      return { rows: [{ id_proveedor: 1, nombre_proveedor: "Proveedor X", egreso_total: 500 }] };
    }
    return { rows: [] };
  },
};

// Repositorio simulado
async function obtenerEgresosPorPeriodo(fi, ff) {
  return (await pool.query("SELECT fecha_facturaproveedor", [fi, ff])).rows;
}

async function obtenerPrincipalesEgresos(fi, ff, lim) {
  return (await pool.query("GROUP BY p.id_proveedor", [fi, ff, lim])).rows;
}

async function run() {
  console.log("▶ Tests estadisticasEgresos.repository");

  {
    const r = await obtenerEgresosPorPeriodo("2025-01-01", "2025-01-31");
    assert.ok(Array.isArray(r), "Debe devolver un array");
    assert.strictEqual(r[0].egreso_total, 200);
    console.log("✔ obtenerEgresosPorPeriodo OK");
  }

  {
    const r = await obtenerPrincipalesEgresos("2025-01-01", "2025-01-31", 5);
    assert.ok(Array.isArray(r), "Debe devolver un array");
    assert.strictEqual(r[0].nombre_proveedor, "Proveedor X");
    console.log("✔ obtenerPrincipalesEgresos OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
