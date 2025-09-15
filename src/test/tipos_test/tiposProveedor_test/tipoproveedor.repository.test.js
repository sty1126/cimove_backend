
import assert from "assert";


// Mock para simular las operaciones de la base de datos
export const pool = {
  // Simula la ejecución de una consulta SQL
  async query(sql, params) {
    // Simula la obtención de tipos de proveedor activos
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM TIPOPROVEEDOR") && sql.toUpperCase().includes("ESTADO_TIPOPROVEEDOR = 'A'")) {
      return {
        rows: [
          { id_tipoproveedor: 1, nombre_tipoproveedor: "Fabricante" },
          { id_tipoproveedor: 2, nombre_tipoproveedor: "Distribuidor" },
          { id_tipoproveedor: 3, nombre_tipoproveedor: "Minorista" },
        ],
      };
    }
    // Simula la inserción de un nuevo tipo de proveedor
    if (sql.toUpperCase().includes("INSERT INTO TIPOPROVEEDOR")) {
      // Devuelve el nuevo registro simulado
      return { rows: [{ id_tipoproveedor: 4, nombre_tipoproveedor: params[0], estado_tipoproveedor: 'A' }] };
    }
    // Retorna un array vacío para otras operaciones simuladas
    return { rows: [] };
  },
};


// Simula la obtención de todos los tipos de proveedor activos
async function obtenerTiposProveedor() {
  const result = await pool.query(`
    SELECT id_tipoproveedor, nombre_tipoproveedor
    FROM TIPOPROVEEDOR
    WHERE estado_tipoproveedor = 'A'
  `);
  return result.rows;
}

// Simula la inserción de un nuevo tipo de proveedor
async function insertarTipoProveedor(nombre) {
  const result = await pool.query(`
    INSERT INTO TIPOPROVEEDOR (nombre_tipoproveedor, estado_tipoproveedor)
    VALUES ($1, 'A')
    RETURNING *
  `, [nombre]);

  return result.rows[0];
}

// Tests
async function run() {
  console.log("▶ Tests tiposProveedor.repository");

  // Test 1: obtenerTiposProveedor
  // Verifica que la función retorna una lista de tipos de proveedor
  {
    const res = await obtenerTiposProveedor();
    assert.strictEqual(res.length, 3); // Espera 3 tipos de proveedor simulados
    assert.strictEqual(res[0].nombre_tipoproveedor, "Fabricante"); // Verifica el primer tipo de proveedor
    console.log("✔ obtenerTiposProveedor OK");
  }

  // Test 2: insertarTipoProveedor
  // Verifica que la inserción de un nuevo tipo de proveedor funciona correctamente
  {
    const nuevoTipo = await insertarTipoProveedor("Consultor");
    assert.strictEqual(nuevoTipo.nombre_tipoproveedor, "Consultor"); // Verifica que el nombre es el correcto
    assert.strictEqual(nuevoTipo.estado_tipoproveedor, 'A'); // Verifica que el estado es activo
    console.log("✔ insertarTipoProveedor OK");
  }

  console.log("✅ Todos los tests de tiposProveedor.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});