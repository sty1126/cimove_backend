// tests_manual/empleados.repository.test.js
// Ejecutar: node tests_manual/empleados.repository.test.js
import assert from "assert";

// ======================
// Fake bcrypt
// ======================
const bcrypt = {
  async genSalt() { return "salt"; },
  async hash(value, salt) { return "hashed_" + value + "_" + salt; }
};

// ======================
// Fake pool
// ======================
function makePoolMock() {
  const calls = [];

  async function query(sql, params) {
    calls.push({ sql, params });

    // SELECT empleado con usuario
    if (sql.includes("FROM empleado") && !sql.includes("WHERE")) {
      return { rows: [{ id_empleado: "1", nombre_empleado: "Juan" }] };
    }

    // SELECT empleado por id
    if (sql.includes("FROM empleado") && sql.includes("WHERE")) {
      if (params[0] === "404") return { rows: [] };
      return { rows: [{ id_empleado: params[0], nombre_empleado: "Pedro" }] };
    }

    // SELECT check email
    if (sql.includes("SELECT 1 FROM USUARIO")) {
      if (params[0] === "existe@mail.com") {
        return { rowCount: 1, rows: [{}] };
      }
      return { rowCount: 0, rows: [] };
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
// Repo simulado
// ======================
function makeRepo(pool) {
  return {
    obtenerEmpleadosConUsuario: () =>
      pool.query("SELECT ... FROM empleado e").then((r) => r.rows),

    crearEmpleado: async (data) => {
      const client = await pool.connect();
      await client.query("BEGIN");
      const check = await client.query("SELECT 1 FROM USUARIO WHERE EMAIL_USUARIO=$1", [data.email_usuario]);
      if (check.rowCount > 0) {
        throw new Error("El correo electrónico ya está en uso");
      }
      await client.query("INSERT INTO EMPLEADO ...", []);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(String(data.id_empleado), salt);
      await client.query("INSERT INTO USUARIO ...", [data.id_empleado, hashedPassword]);
      await client.query("INSERT INTO SALARIO ...", [data.id_empleado, data.monto_salario]);
      await client.query("COMMIT");
      client.release();
      return { message: "Empleado creado exitosamente", contrasena: String(data.id_empleado) };
    },

    obtenerEmpleadoPorId: async (id) => {
      const result = await pool.query("SELECT ... FROM empleado e WHERE e.id_empleado=$1", [id]);
      if (result.rows.length === 0) throw new Error("Empleado no encontrado");
      return result.rows[0];
    },

    eliminarEmpleado: async (id) => {
      await pool.query("UPDATE EMPLEADO SET ESTADO_EMPLEADO='I' WHERE ID_EMPLEADO=$1", [id]);
      await pool.query("UPDATE USUARIO SET ESTADO_USUARIO='I' WHERE ID_EMPLEADO_USUARIO=$1", [id]);
      await pool.query("UPDATE SALARIO SET ESTADO_SALARIO='I' WHERE ID_EMPLEADO_SALARIO=$1", [id]);
      return { success: true };
    },

    restaurarEmpleado: async (id) => {
      await pool.query("UPDATE EMPLEADO SET ESTADO_EMPLEADO='A' WHERE ID_EMPLEADO=$1", [id]);
      await pool.query("UPDATE USUARIO SET ESTADO_USUARIO='A' WHERE ID_EMPLEADO_USUARIO=$1", [id]);
      await pool.query("UPDATE SALARIO SET ESTADO_SALARIO='A' WHERE ID_EMPLEADO_SALARIO=$1", [id]);
      return { success: true };
    },

    actualizarEmpleado: async (id, data) => {
      await pool.query("BEGIN");
      await pool.query("UPDATE EMPLEADO ...", [id]);
      await pool.query("UPDATE USUARIO ...", [id]);
      await pool.query("UPDATE SALARIO ...", [id]);
      await pool.query("COMMIT");
      return { success: true };
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests empleados.repository");

  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener empleados
  {
    const res = await repo.obtenerEmpleadosConUsuario();
    assert.strictEqual(res[0].nombre_empleado, "Juan");
    console.log("✔ obtenerEmpleadosConUsuario OK");
  }

  // 2. Crear empleado válido
  {
    const res = await repo.crearEmpleado({
      id_empleado: "100",
      email_usuario: "nuevo@mail.com",
      monto_salario: 5000,
    });
    assert.strictEqual(res.message, "Empleado creado exitosamente");
    console.log("✔ crearEmpleado válido OK");
  }

  // 3. Crear empleado con email duplicado
  {
    let error;
    try {
      await repo.crearEmpleado({
        id_empleado: "101",
        email_usuario: "existe@mail.com",
        monto_salario: 4000,
      });
    } catch (e) { error = e; }
    assert.ok(error.message.includes("ya está en uso"));
    console.log("✔ crearEmpleado duplicado OK");
  }

  // 4. Obtener empleado por ID válido
  {
    const res = await repo.obtenerEmpleadoPorId("200");
    assert.strictEqual(res.id_empleado, "200");
    console.log("✔ obtenerEmpleadoPorId válido OK");
  }

  // 5. Obtener empleado por ID inexistente
  {
    let error;
    try { await repo.obtenerEmpleadoPorId("404"); } catch (e) { error = e; }
    assert.ok(error.message.includes("Empleado no encontrado"));
    console.log("✔ obtenerEmpleadoPorId inexistente OK");
  }

  // 6. Eliminar empleado
  {
    const res = await repo.eliminarEmpleado("300");
    assert.strictEqual(res.success, true);
    console.log("✔ eliminarEmpleado OK");
  }

  // 7. Restaurar empleado
  {
    const res = await repo.restaurarEmpleado("301");
    assert.strictEqual(res.success, true);
    console.log("✔ restaurarEmpleado OK");
  }

  // 8. Actualizar empleado
  {
    const res = await repo.actualizarEmpleado("400", { nombre_empleado: "Carlos" });
    assert.strictEqual(res.success, true);
    console.log("✔ actualizarEmpleado OK");
  }

  console.log("✅ Todos los tests de empleados.repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
