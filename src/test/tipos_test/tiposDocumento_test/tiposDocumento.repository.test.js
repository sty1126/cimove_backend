
import assert from "assert";


export const pool = {
  async query(sql) {
    // Mock para la consulta de tipos de documento
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM TIPODOCUMENTO")) {
      return {
        rows: [
          { id_tipodocumento: 1, nombre_tipodocumento: "Cédula de Ciudadanía" },
          { id_tipodocumento: 2, nombre_tipodocumento: "Tarjeta de Identidad" },
          { id_tipodocumento: 3, nombre_tipodocumento: "Cédula de Extranjería" },
        ],
      };
    }
    return { rows: [] };
  },
};


async function obtenerTiposDocumento() {
  const result = await pool.query("SELECT * FROM TIPODOCUMENTO");
  return result.rows;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposDocumento.repository");

  // Test: obtenerTiposDocumento
  {
    const res = await obtenerTiposDocumento();
    assert.strictEqual(res.length, 3);
    assert.strictEqual(res[0].nombre_tipodocumento, "Cédula de Ciudadanía");
    console.log("✔ obtenerTiposDocumento OK");
  }

  console.log("✅ Todos los tests de tiposDocumento.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});