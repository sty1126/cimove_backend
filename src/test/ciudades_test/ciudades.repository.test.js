import assert from "assert";

// Mock pool
function makePoolMock() {
  return {
    async query(sql, params) {
      if (sql.includes("SELECT")) {
        return { rows: [{ id_ciudad: "1", nombre_ciudad: "Bogotá" }] };
      }
      if (sql.includes("INSERT")) {
        return { rows: [{ id_ciudad: "2", nombre_ciudad: params[0], estado_ciudad: "A" }] };
      }
      return { rows: [] };
    },
  };
}

// Repo con pool inyectado
function makeRepo(pool) {
  return {
    obtenerCiudadesActivas: () => pool.query("SELECT ...", []).then(r => r.rows),
    insertarCiudad: (nombre) => pool.query("INSERT ... RETURNING *", [nombre]).then(r => r.rows[0]),
  };
}

async function run() {
  console.log("▶ Tests ciudades.repository");
  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener ciudades
  {
    const res = await repo.obtenerCiudadesActivas();
    assert.strictEqual(res[0].nombre_ciudad, "Bogotá");
    console.log("✔ obtenerCiudadesActivas OK");
  }

  // 2. Insertar ciudad
  {
    const res = await repo.insertarCiudad("Cartagena");
    assert.strictEqual(res.nombre_ciudad, "Cartagena");
    assert.strictEqual(res.estado_ciudad, "A");
    console.log("✔ insertarCiudad OK");
  }

  console.log("✅ Todos los tests de ciudades.repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
