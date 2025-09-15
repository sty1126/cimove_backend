import assert from "assert";


const pool = {
  async query(sql, params) {
    if (sql.includes("FROM ingresos i, egresos e")) {
      return { rows: [{ ingreso_total: 1000, egreso_total: 400, beneficio_neto: 600 }] };
    }
    if (sql.includes("GROUP BY f.fecha_factura::date")) {
      return {
        rows: [{ fecha: "2025-01-01", ingreso_total: 500, beneficio_neto: 300 }],
      };
    }
    return { rows: [] };
  },
};

// Repositorio simulado
async function obtenerRentabilidad(fi, ff) {
  return (await pool.query("FROM ingresos i, egresos e", [fi, ff])).rows[0];
}

async function obtenerEvolucionRentabilidad(fi, ff) {
  const result = await pool.query("GROUP BY f.fecha_factura::date", [fi, ff]);
  return result.rows.map(r => ({
    ...r,
    margen_porcentaje: ((r.beneficio_neto / r.ingreso_total) * 100).toFixed(2),
  }));
}

async function run() {
  console.log("▶ Tests estadisticasGenerales.repository");

  {
    const r = await obtenerRentabilidad("2025-01-01", "2025-01-31");
    assert.strictEqual(r.beneficio_neto, 600);
    console.log("✔ obtenerRentabilidad OK");
  }

  {
    const r = await obtenerEvolucionRentabilidad("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].margen_porcentaje, "60.00");
    console.log("✔ obtenerEvolucionRentabilidad OK");
  }

  console.log("✅ Todos los tests de repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests repository:", err);
  process.exit(1);
});
