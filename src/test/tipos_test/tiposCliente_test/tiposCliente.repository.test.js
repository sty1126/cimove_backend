
import assert from "assert";
import { obtenerTiposCliente } from "../../../modules/tipos/tiposCliente/tiposCliente.repository.js"; 


export const pool = {
  async query(sql) {
    // Mock para la consulta de tipos de cliente
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM TIPOCLIENTE")) {
      return {
        rows: [
          { id_tipocliente: 1, descripcion_tipocliente: "Persona Natural" },
          { id_tipocliente: 2, descripcion_tipocliente: "Persona Jurídica" },
        ],
      };
    }
    return { rows: [] };
  },
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposCliente.repository");

  // Inyectar el pool simulado al repositorio (requiere que el repositorio esté escrito para recibirlo)
  // Nota: Si tu repositorio usa un pool global, necesitarás sobrescribirlo temporalmente.
  // Por simplicidad en este ejemplo, se asume que 'obtenerTiposCliente' utiliza el pool de este archivo.
  
  // Test: obtenerTiposCliente
  {
    const res = await obtenerTiposCliente();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].descripcion_tipocliente, "Persona Natural");
    console.log("✔ obtenerTiposCliente OK");
  }

  console.log("✅ Todos los tests de tiposCliente.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});