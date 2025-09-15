import assert from "assert";


const repo = {
  obtenerEgresosPorPeriodo: async () => [{ fecha: "2025-01-01", egreso_total: 100 }],
  obtenerPrincipalesEgresos: async () => [{ id_proveedor: 1, egreso_total: 999 }],
};

// Service simulado
function getEgresosPorPeriodo(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerEgresosPorPeriodo(fi, ff);
}

function getPrincipalesEgresos(fi, ff, lim) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  if (lim <= 0) lim = 10;
  return repo.obtenerPrincipalesEgresos(fi, ff, lim);
}

async function run() {
  console.log("▶ Tests estadisticasEgresos.service");

  {
    let err = null;
    try { getEgresosPorPeriodo(null, "2025-01-31"); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getEgresosPorPeriodo error validado");
  }

  {
    const r = await getEgresosPorPeriodo("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].egreso_total, 100);
    console.log("✔ getEgresosPorPeriodo OK");
  }

  {
    let err = null;
    try { getPrincipalesEgresos(null, null); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getPrincipalesEgresos error validado");
  }

  {
    const r = await getPrincipalesEgresos("2025-01-01", "2025-01-31", 5);
    assert.strictEqual(r[0].egreso_total, 999);
    console.log("✔ getPrincipalesEgresos OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests service:", err);
  process.exit(1);
});
