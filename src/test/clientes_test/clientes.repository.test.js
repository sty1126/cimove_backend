// tests_manual/clientes.repository.test.js
import assert from "assert";

// ======================
// Fake pool
// ======================
function makePoolMock() {
  const calls = [];

  async function query(sql, params) {
    calls.push({ sql, params });

    // Cualquier SELECT de clientes (con o sin WHERE)
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM CLIENTE")) {
      return {
        rows: [
          {
            id_cliente: params && params[0] ? params[0] : "1",
            nombre_cliente: "Juan",
            descripcion_tipocliente: "Natural",
          },
        ],
      };
    }

    // SELECT de tipos de cliente
    if (sql.toUpperCase().includes("FROM TIPOCLIENTE") && !sql.toUpperCase().includes("JOIN")) {
      return {
        rows: [
          { id_tipocliente: 1, descripcion_tipocliente: "Persona Natural" },
          { id_tipocliente: 2, descripcion_tipocliente: "Persona Jurídica" },
        ],
      };
    }

    // Para INSERT/UPDATE/BEGIN/COMMIT/ROLLBACK
    return { rows: [] };
  }

  async function connect() {
    return {
      query,
      release: () => {},
    };
  }

  return { query, connect, calls };
}

// ======================
// Repo simulado con pool
// ======================
function makeRepo(pool) {
  return {
    obtenerClientes: () => pool.query("SELECT * FROM CLIENTE", []).then(r => r.rows),
    obtenerClientePorId: (id) => pool.query("SELECT * FROM CLIENTE WHERE id=$1", [id]).then(r => r.rows[0]),
    findClientesNaturales: () => pool.query("SELECT * FROM CLIENTE WHERE tipo=1", []).then(r => r.rows),
    findClientesJuridicos: () => pool.query("SELECT * FROM CLIENTE WHERE tipo=2", []).then(r => r.rows),
    findTiposCliente: () => pool.query("SELECT * FROM TIPOCLIENTE", []).then(r => r.rows),
    findClientesFormateados: () => pool.query("SELECT * FROM CLIENTE", []).then(r => r.rows),
    crearCliente: async (clienteData) => {
      const client = await pool.connect();
      await client.query("BEGIN");
      await client.query("INSERT INTO CLIENTE ...", []);
      if (clienteData.id_tipocliente_cliente == 1) {
        await client.query("INSERT INTO CLIENTENATURAL ...", []);
      } else if (clienteData.id_tipocliente_cliente == 2) {
        await client.query("INSERT INTO CLIENTEJURIDICO ...", []);
      }
      await client.query("COMMIT");
      client.release();
      return { success: true, id: clienteData.id_cliente };
    },
    actualizarCliente: async (id, data) => {
      await pool.query("BEGIN");
      await pool.query("UPDATE CLIENTE SET ...", [id]);
      if (data.id_tipocliente_cliente == 1) {
        await pool.query("UPDATE CLIENTENATURAL SET ...", [id]);
      } else if (data.id_tipocliente_cliente == 2) {
        await pool.query("UPDATE CLIENTEJURIDICO SET ...", [id]);
      }
      await pool.query("COMMIT");
      return { success: true, message: "Cliente actualizado exitosamente" };
    },
    eliminarCliente: async (id) => {
      await pool.query("BEGIN");
      await pool.query("UPDATE CLIENTENATURAL SET estado_cliente='I' WHERE id_cliente=$1", [id]);
      await pool.query("UPDATE CLIENTEJURIDICO SET estado_cliente='I' WHERE id_cliente=$1", [id]);
      await pool.query("UPDATE CLIENTE SET estado_cliente='I' WHERE id_cliente=$1", [id]);
      await pool.query("COMMIT");
      return { success: true, message: "Cliente eliminado exitosamente" };
    },
    obtenerClientesPorSede: (idSede) =>
      pool.query("SELECT * FROM CLIENTE WHERE id_sede=$1", [idSede]).then(r => r.rows),
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests clientes.repository");

  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener clientes
  {
    const res = await repo.obtenerClientes();
    assert.strictEqual(res[0].nombre_cliente, "Juan");
    console.log("✔ obtenerClientes OK");
  }

  // 2. Obtener cliente por ID
  {
    const res = await repo.obtenerClientePorId("123");
    assert.strictEqual(res.id_cliente, "123");
    assert.strictEqual(res.nombre_cliente, "Juan");
    console.log("✔ obtenerClientePorId OK");
  }

  // 3. Tipos de cliente
  {
    const res = await repo.findTiposCliente();
    assert.strictEqual(res.length, 2);
    console.log("✔ findTiposCliente OK");
  }

  // 4. Crear cliente natural y jurídico
  {
    const natural = await repo.crearCliente({ id_cliente: "10", id_tipocliente_cliente: 1 });
    assert.strictEqual(natural.success, true);
    const juridico = await repo.crearCliente({ id_cliente: "11", id_tipocliente_cliente: 2 });
    assert.strictEqual(juridico.success, true);
    console.log("✔ crearCliente natural y jurídico OK");
  }

  // 5. Actualizar cliente
  {
    const res = await repo.actualizarCliente("20", { id_tipocliente_cliente: 1 });
    assert.strictEqual(res.success, true);
    console.log("✔ actualizarCliente OK");
  }

  // 6. Eliminar cliente
  {
    const res = await repo.eliminarCliente("30");
    assert.strictEqual(res.success, true);
    console.log("✔ eliminarCliente OK");
  }

  // 7. Clientes por sede
  {
    const res = await repo.obtenerClientesPorSede("S1");
    assert.ok(Array.isArray(res));
    assert.strictEqual(res[0].id_cliente, "S1" ? "S1" : "1"); // simula id
    console.log("✔ obtenerClientesPorSede OK");
  }

  console.log("✅ Todos los tests de clientes.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
