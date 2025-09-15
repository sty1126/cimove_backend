
import assert from "assert";

//pool
function makePoolMock() {
  const calls = [];

  async function query(sql, params) {
    calls.push({ sql, params });

    // SELECT de proveedores
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM PROVEEDOR") && sql.toUpperCase().includes("JOIN")) {
      if (sql.includes("WHERE p.ID_PROVEEDOR = $1")) {
        return {
          rows: [
            {
              id_proveedor: params[0],
              nombre_proveedor: "Proveedor X",
              nombre_tipoproveedor: "Distribuidor",
            },
          ],
        };
      }
      return {
        rows: [
          {
            id_proveedor: 1,
            nombre_proveedor: "Proveedor 1",
            nombre_tipoproveedor: "Mayorista",
          },
        ],
      };
    }

    // SELECT de tipos de proveedor
    if (sql.toUpperCase().includes("FROM TIPOPROVEEDOR")) {
      return {
        rows: [
          { id_tipoproveedor: 1, nombre_tipoproveedor: "Mayorista" },
          { id_tipoproveedor: 2, nombre_tipoproveedor: "Minorista" },
        ],
      };
    }

    // INSERT tipo proveedor
    if (sql.startsWith("INSERT INTO TIPOPROVEEDOR")) {
      return { rows: [{ id_tipoproveedor: 3, nombre_tipoproveedor: params[0] }] };
    }

    // INSERT proveedor
    if (sql.startsWith("INSERT INTO PROVEEDOR")) {
      return { rows: [{ id_proveedor: params[0], nombre_proveedor: params[1] }] };
    }

    // SELECT proveedorExiste
    if (sql.startsWith("SELECT * FROM PROVEEDOR WHERE id_proveedor = $1")) {
      return { rows: [{ id_proveedor: params[0], nombre_proveedor: "Proveedor Existe" }] };
    }

    // UPDATE proveedor
    if (sql.startsWith("UPDATE PROVEEDOR") && sql.includes("RETURNING *") && !sql.includes("ESTADO_PROVEEDOR = 'I'")) {
      return { rows: [{ id_proveedor: params[9], nombre_proveedor: params[0], estado_proveedor: params[8] ?? "A" }] };
    }

    // Eliminar proveedor (inactivar)
    if (sql.startsWith("UPDATE PROVEEDOR SET ESTADO_PROVEEDOR = 'I'")) {
      return { rows: [{ id_proveedor: params[0], estado_proveedor: "I" }] };
    }

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
    obtenerTodos: () =>
      pool.query(
        `SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR FROM PROVEEDOR p 
         INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR`,
        []
      ).then(r => r.rows),

    obtenerPorId: (id) =>
      pool.query(
        `SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR
         FROM PROVEEDOR p
         INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR
         WHERE p.ID_PROVEEDOR = $1`,
        [id]
      ).then(r => r.rows[0]),

    obtenerTipos: () => pool.query("SELECT * FROM TIPOPROVEEDOR WHERE ESTADO_TIPOPROVEEDOR = 'A'", []).then(r => r.rows),

    crearTipo: (nombre) =>
      pool.query(
        "INSERT INTO TIPOPROVEEDOR (NOMBRE_TIPOPROVEEDOR, ESTADO_TIPOPROVEEDOR) VALUES ($1, 'A') RETURNING *",
        [nombre]
      ).then(r => r.rows[0]),

    crearProveedor: (data) =>
      pool.query("INSERT INTO PROVEEDOR (...) VALUES (...) RETURNING *", [
        data.id_proveedor,
        data.nombre_proveedor,
      ]).then(r => r.rows[0]),

    proveedorExiste: (id) => pool.query("SELECT * FROM PROVEEDOR WHERE id_proveedor = $1", [id]).then(r => r.rows[0]),

    actualizarProveedor: (id, datos) =>
      pool.query("UPDATE PROVEEDOR SET ... RETURNING *", [
        datos.nombre_proveedor,
        datos.id_ciudad_proveedor,
        datos.direccion_proveedor,
        datos.telefono_proveedor,
        datos.email_proveedor,
        datos.id_tipoproveedor_proveedor,
        datos.representante_proveedor,
        datos.saldo_proveedor,
        datos.estado_proveedor,
        id,
      ]).then(r => r.rows[0]),

    eliminarProveedor: (id) =>
      pool.query("UPDATE PROVEEDOR SET ESTADO_PROVEEDOR = 'I' WHERE ID_PROVEEDOR = $1 RETURNING *", [id]).then(r => r.rows[0]),
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests proveedores.repository");

  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener proveedores
  {
    const res = await repo.obtenerTodos();
    assert.strictEqual(res[0].nombre_proveedor, "Proveedor 1");
    console.log("✔ obtenerTodos OK");
  }

  // 2. Obtener proveedor por ID
  {
    const res = await repo.obtenerPorId(5);
    assert.strictEqual(res.id_proveedor, 5);
    assert.strictEqual(res.nombre_tipoproveedor, "Distribuidor");
    console.log("✔ obtenerPorId OK");
  }

  // 3. Obtener tipos
  {
    const res = await repo.obtenerTipos();
    assert.strictEqual(res.length, 2);
    console.log("✔ obtenerTipos OK");
  }

  // 4. Crear tipo proveedor
  {
    const res = await repo.crearTipo("Exportador");
    assert.strictEqual(res.nombre_tipoproveedor, "Exportador");
    console.log("✔ crearTipo OK");
  }

  // 5. Crear proveedor
  {
    const res = await repo.crearProveedor({ id_proveedor: 20, nombre_proveedor: "Nuevo Prov" });
    assert.strictEqual(res.id_proveedor, 20);
    assert.strictEqual(res.nombre_proveedor, "Nuevo Prov");
    console.log("✔ crearProveedor OK");
  }

  // 6. Verificar proveedor existe
  {
    const res = await repo.proveedorExiste(30);
    assert.strictEqual(res.id_proveedor, 30);
    console.log("✔ proveedorExiste OK");
  }

  // 7. Actualizar proveedor
  {
    const res = await repo.actualizarProveedor(40, {
      nombre_proveedor: "Prov Actualizado",
      id_ciudad_proveedor: 1,
      direccion_proveedor: "Calle X",
      telefono_proveedor: "111",
      email_proveedor: "prov@test.com",
      id_tipoproveedor_proveedor: 2,
      representante_proveedor: "Juan Perez",
      saldo_proveedor: 500,
      estado_proveedor: "A",
    });
    assert.strictEqual(res.id_proveedor, 40);
    assert.strictEqual(res.nombre_proveedor, "Prov Actualizado");
    console.log("✔ actualizarProveedor OK");
  }

  // 8. Eliminar proveedor
  {
    const res = await repo.eliminarProveedor(50);
    assert.strictEqual(res.estado_proveedor, "I");
    console.log("✔ eliminarProveedor OK");
  }

  console.log("✅ Todos los tests de proveedores.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
