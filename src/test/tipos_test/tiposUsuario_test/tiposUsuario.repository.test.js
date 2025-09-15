
import assert from "assert";


export const pool = {
  async query(sql) {
    // Mock para la consulta de tipos de usuario activos
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM TIPOUSUARIO") && sql.toUpperCase().includes("WHERE ESTADO_TIPOUSUARIO = 'A'")) {
      return {
        rows: [
          { id_tipousuario: 1, nombre_tipousuario: "Administrador", estado_tipousuario: 'A' },
          { id_tipousuario: 2, nombre_tipousuario: "Empleado", estado_tipousuario: 'A' },
        ],
      };
    }
    return { rows: [] };
  },
};

// ======================
// Repository function
// ======================
async function fetchActiveTiposUsuario() {
  const result = await pool.query(
    "SELECT * FROM TIPOUSUARIO WHERE ESTADO_TIPOUSUARIO = 'A'"
  );
  return result.rows;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposUsuario.repository");

  // Test: fetchActiveTiposUsuario
  {
    const res = await fetchActiveTiposUsuario();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre_tipousuario, "Administrador");
    assert.strictEqual(res[1].estado_tipousuario, 'A');
    console.log("✔ fetchActiveTiposUsuario OK");
  }

  console.log("✅ Todos los tests de tiposUsuario.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});