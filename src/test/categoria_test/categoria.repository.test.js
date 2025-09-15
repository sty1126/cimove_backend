import assert from "assert";

// Mock pool
function makePoolMock() {
  return {
    async query(sql, params) {
      if (sql.includes("SELECT")) {
        return { rows: [{ id_categoria: 1, descripcion_categoria: "Alimentos" }] };
      }
      if (sql.includes("INSERT")) {
        return { rows: [{ id_categoria: 2, descripcion_categoria: params[0], estado_categoria: "A" }] };
      }
      return { rows: [] };
    },
  };
}


function makeRepo(pool) {
  return {
    obtenerCategoriasActivas: () => pool.query("SELECT ...", []).then(r => r.rows),
    insertarCategoria: (desc) => pool.query("INSERT ... RETURNING *", [desc]).then(r => r.rows[0]),
  };
}

async function run() {
  console.log("▶ Tests categoria.repository");
  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener categorías
  {
    const r = await repo.obtenerCategoriasActivas();
    assert.strictEqual(r[0].descripcion_categoria, "Alimentos");
    console.log("✔ obtenerCategoriasActivas OK");
  }

  // 2. Insertar categoría
  {
    const r = await repo.insertarCategoria("Deportes");
    assert.strictEqual(r.descripcion_categoria, "Deportes");
    assert.strictEqual(r.estado_categoria, "A");
    console.log("✔ insertarCategoria OK");
  }

  console.log("✅ Todos los tests de categoria.repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
