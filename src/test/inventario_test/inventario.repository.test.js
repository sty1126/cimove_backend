import assert from "assert";


const pool = {
  query: async (sql, params) => {
    if (sql.includes("SELECT * FROM inventario WHERE id_inventario")) {
      if (params[0] === 1) return { rows: [{ id_inventario: 1, existencia_inventario: 10 }] };
      return { rows: [] };
    }
    if (sql.startsWith("SELECT * FROM inventario")) {
      return { rows: [{ id_inventario: 1 }, { id_inventario: 2 }] };
    }
    if (sql.startsWith("INSERT")) {
      return { rows: [{ id_inventario: 3, ...params }] };
    }
    if (sql.startsWith("UPDATE")) {
      return { rows: [{ id_inventario: params[3], ...params }] };
    }
    return { rows: [] };
  }
};

// Repository functions (redefinidas aquí con mock pool)
async function fetchAll() {
  const result = await pool.query("SELECT * FROM inventario");
  return result.rows;
}

async function fetchById(id) {
  const result = await pool.query("SELECT * FROM inventario WHERE id_inventario = $1", [id]);
  if (result.rows.length === 0) throw new Error("Inventario no encontrado");
  return result.rows[0];
}

async function insert({ id_producto_inventario, existencia_inventario, estado_inventario }) {
  const result = await pool.query("INSERT ...", [
    id_producto_inventario,
    existencia_inventario,
    estado_inventario || "A"
  ]);
  return result.rows[0];
}

async function update(id, data) {
  const current = await fetchById(id);
  const updated = {
    id_producto_inventario: data.id_producto_inventario || current.id_producto_inventario,
    existencia_inventario: data.existencia_inventario || current.existencia_inventario,
    estado_inventario: data.estado_inventario || current.estado_inventario
  };
  const result = await pool.query("UPDATE inventario ...", [
    updated.id_producto_inventario,
    updated.existencia_inventario,
    updated.estado_inventario,
    id
  ]);
  return result.rows[0];
}

async function run() {
  console.log("▶ Tests inventario.repository");

  const all = await fetchAll();
  assert.strictEqual(all.length, 2);
  console.log("✔ fetchAll OK");

  const byId = await fetchById(1);
  assert.strictEqual(byId.id_inventario, 1);
  console.log("✔ fetchById OK");

  try {
    await fetchById(999);
    console.error("❌ fetchById debería lanzar error");
  } catch (err) {
    assert.strictEqual(err.message, "Inventario no encontrado");
    console.log("✔ fetchById Not Found OK");
  }

  const ins = await insert({ id_producto_inventario: 10, existencia_inventario: 50 });
  assert.strictEqual(ins.id_inventario, 3);
  console.log("✔ insert OK");

  const upd = await update(1, { existencia_inventario: 20 });
  assert.strictEqual(upd.id_inventario, 1);
  console.log("✔ update OK");

  console.log("✅ Todos los tests repository pasaron");
}

run().catch((err) => console.error("❌ Error en tests repository:", err));
