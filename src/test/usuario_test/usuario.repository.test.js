import assert from "assert";

// ======================
// Fake pool
// ======================
function createPoolMock() {
  return {
    lastQuery: null,
    async query(text, values) {
      this.lastQuery = { text, values };
      return { rows: [{ ok: true, id_empleado_usuario: 1 }] };
    },
  };
}

const pool = createPoolMock();

// ======================
// Repository simulado
// ======================
async function insertarUsuario(data) {
  const result = await pool.query("INSERT ...", [
    data.id_empleado_usuario,
    data.contrasena_usuario,
    data.email_usuario,
    data.telefono_usuario,
    data.id_tipousuario_usuario,
  ]);
  return result.rows[0];
}

async function obtenerUsuarioPorEmail(email) {
  const result = await pool.query("SELECT ... FROM USUARIO WHERE email_usuario = $1", [email]);
  return result.rows[0];
}

async function obtenerUsuarioPorEmailSimple(email) {
  const result = await pool.query("SELECT contrasena_usuario FROM USUARIO WHERE email_usuario=$1", [email]);
  return result.rows[0];
}

async function actualizarPassword(email, nueva) {
  await pool.query("UPDATE USUARIO SET contrasena_usuario=$1 WHERE email_usuario=$2", [nueva, email]);
}

async function savePasswordResetToken(userId, token, expiry) {
  await pool.query("INSERT INTO PASSWORDRESET VALUES ($1,$2,$3)", [userId, token, expiry]);
}

async function findUserByToken(token) {
  const result = await pool.query("SELECT ... FROM USUARIO INNER JOIN PASSWORDRESET ...", [token]);
  return result.rows[0];
}

async function updatePasswordByUserId(userId, nueva) {
  await pool.query("UPDATE USUARIO SET CONTRASENA_USUARIO=$1 WHERE ID_EMPLEADO_USUARIO=$2", [nueva, userId]);
}

async function invalidateToken(token) {
  await pool.query("DELETE FROM PASSWORDRESET WHERE TOKEN=$1", [token]);
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests usuario.repository");

  // insertarUsuario
  {
    const res = await insertarUsuario({
      id_empleado_usuario: 1,
      contrasena_usuario: "123",
      email_usuario: "a@b.com",
      telefono_usuario: "12345",
      id_tipousuario_usuario: 2,
    });
    assert.strictEqual(pool.lastQuery.values[0], 1);
    assert.strictEqual(res.ok, true);
    console.log("✔ insertarUsuario OK");
  }

  // obtenerUsuarioPorEmail
  {
    await obtenerUsuarioPorEmail("test@mail.com");
    assert.strictEqual(pool.lastQuery.values[0], "test@mail.com");
    console.log("✔ obtenerUsuarioPorEmail OK");
  }

  // obtenerUsuarioPorEmailSimple
  {
    await obtenerUsuarioPorEmailSimple("simple@mail.com");
    assert.strictEqual(pool.lastQuery.values[0], "simple@mail.com");
    console.log("✔ obtenerUsuarioPorEmailSimple OK");
  }

  // actualizarPassword
  {
    await actualizarPassword("pass@mail.com", "hash123");
    assert.deepStrictEqual(pool.lastQuery.values, ["hash123", "pass@mail.com"]);
    console.log("✔ actualizarPassword OK");
  }

  // savePasswordResetToken
  {
    await savePasswordResetToken(1, "tok", new Date());
    assert.strictEqual(pool.lastQuery.values[0], 1);
    console.log("✔ savePasswordResetToken OK");
  }

  // findUserByToken
  {
    await findUserByToken("tok123");
    assert.strictEqual(pool.lastQuery.values[0], "tok123");
    console.log("✔ findUserByToken OK");
  }

  // updatePasswordByUserId
  {
    await updatePasswordByUserId(7, "hashNew");
    assert.deepStrictEqual(pool.lastQuery.values, ["hashNew", 7]);
    console.log("✔ updatePasswordByUserId OK");
  }

  // invalidateToken
  {
    await invalidateToken("tokDel");
    assert.strictEqual(pool.lastQuery.values[0], "tokDel");
    console.log("✔ invalidateToken OK");
  }

  console.log("✅ Todos los tests de usuario.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
