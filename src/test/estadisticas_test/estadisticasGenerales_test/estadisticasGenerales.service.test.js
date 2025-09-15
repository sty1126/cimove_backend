import assert from "assert";


const repo = {
  obtenerRentabilidad: async () => ({ ingreso_total: 1000, egreso_total: 400, beneficio_neto: 600 }),
  obtenerEvolucionRentabilidad: async () => [
    { fecha: "2025-01-01", ingreso_total: 500, beneficio_neto: 300, margen_porcentaje: 60 },
  ],
};

// Service simulado
function getRentabilidad(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerRentabilidad(fi, ff);
}

function getEvolucionRentabilidad(fi, ff) {
  if (!fi || !ff) throw new Error("Debe especificar fechaInicio y fechaFin");
  return repo.obtenerEvolucionRentabilidad(fi, ff);
}

async function run() {
  console.log("▶ Tests estadisticasGenerales.service");

  {
    let err = null;
    try { getRentabilidad(null, "2025-01-31"); } catch (e) { err = e; }
    assert.ok(err, "Debe lanzar error si faltan fechas");
    console.log("✔ getRentabilidad error validado");
  }

  {
    const r = await getRentabilidad("2025-01-01", "2025-01-31");
    assert.strictEqual(r.beneficio_neto, 600);
    console.log("✔ getRentabilidad OK");
  }

  {
    const r = await getEvolucionRentabilidad("2025-01-01", "2025-01-31");
    assert.strictEqual(r[0].margen_porcentaje, 60);
    console.log("✔ getEvolucionRentabilidad OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests service:", err);
  process.exit(1);
});
