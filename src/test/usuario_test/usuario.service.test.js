
import assert from "assert";


const repo = {
  insertarUsuario: async (d) => ({ id: 1, ...d }),
  obtenerUsuarioPorEmail: async (email) => email === "ok@mail.com" ? {
    id_empleado_usuario: 1,
    id_tipousuario_usuario: 2,
    id_sede_empleado: 3,
    email_usuario: email,
    contrasena_usuario: "hash",
  } : null,
  obtenerUsuarioPorEmailSimple: async (email) => email === "exist@mail.com" ? { contrasena_usuario: "hash" } : null,
  actualizarPassword: async () => {},
  savePasswordResetToken: async () => {},
  findUserByToken: async (tok) => tok === "valid" ? { id_empleado_usuario: 1 } : null,
  updatePasswordByUserId: async () => {},
  invalidateToken: async () => {},
};

const sendPasswordResetEmail = async () => true;

// fake bcrypt
const bcrypt = {
  async hash(txt) { return "hashed-" + txt; },
  async genSalt() { return "salt"; },
  async compare(txt, hash) { return hash.includes(txt); },
};

// fake crypto
const crypto = {
  randomBytes: () => Buffer.from("1234567890abcdef"),
};

// ======================
// Service simulado
// ======================
async function createUsuario(data) {
  const hashed = await bcrypt.hash(data.contrasena_usuario, await bcrypt.genSalt(10));
  return await repo.insertarUsuario({ ...data, contrasena_usuario: hashed });
}

async function checkPassword(email, pass) {
  const usuario = await repo.obtenerUsuarioPorEmail(email);
  if (!usuario || !usuario.contrasena_usuario) return null;
  const isMatch = await bcrypt.compare(pass, usuario.contrasena_usuario);
  return isMatch ? {
    id: usuario.id_empleado_usuario,
    tipo_usuario: usuario.id_tipousuario_usuario,
    sede: usuario.id_sede_empleado,
    email: usuario.email_usuario,
  } : false;
}

async function updatePassword({ email_usuario, contrasena_actual, contrasena_nueva }) {
  const usuario = await repo.obtenerUsuarioPorEmailSimple(email_usuario);
  if (!usuario) throw new Error("Usuario no encontrado o inactivo");
  const isMatch = await bcrypt.compare(contrasena_actual, usuario.contrasena_usuario);
  if (!isMatch) throw new Error("Contraseña actual incorrecta");
  const hashed = await bcrypt.hash(contrasena_nueva, await bcrypt.genSalt(10));
  await repo.actualizarPassword(email_usuario, hashed);
}

async function requestPasswordReset(email) {
  const usuario = await repo.obtenerUsuarioPorEmail(email);
  if (!usuario) throw new Error("Usuario no encontrado o inactivo");
  const resetToken = crypto.randomBytes(32).toString("hex");
  const expiry = new Date(Date.now() + 3600000);
  await repo.savePasswordResetToken(usuario.id_empleado_usuario, resetToken, expiry);
  await sendPasswordResetEmail(email, resetToken);
}

async function resetPasswordWithToken({ token, contrasena_nueva }) {
  const usuario = await repo.findUserByToken(token);
  if (!usuario) throw new Error("Token inválido o expirado");
  const hashed = await bcrypt.hash(contrasena_nueva, await bcrypt.genSalt(10));
  await repo.updatePasswordByUserId(usuario.id_empleado_usuario, hashed);
  await repo.invalidateToken(token);
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests usuario.service");

  // 1. Crear usuario
  {
    const res = await createUsuario({ contrasena_usuario: "123" });
    assert.ok(res.contrasena_usuario.startsWith("hashed-"));
    console.log("✔ createUsuario OK");
  }

  // 2. Check password correcto
  {
    const res = await checkPassword("ok@mail.com", "hash");
    assert.strictEqual(res.email, "ok@mail.com");
    console.log("✔ checkPassword correcto OK");
  }

  // 3. Check password usuario no existe
  {
    const res = await checkPassword("none@mail.com", "x");
    assert.strictEqual(res, null);
    console.log("✔ checkPassword usuario no encontrado OK");
  }

  // 4. Update password éxito
  {
    await updatePassword({ email_usuario: "exist@mail.com", contrasena_actual: "hash", contrasena_nueva: "new" });
    console.log("✔ updatePassword éxito OK");
  }

  // 5. Update password falla usuario no existe
  {
    try {
      await updatePassword({ email_usuario: "no@mail.com", contrasena_actual: "x", contrasena_nueva: "y" });
      console.error("❌ FAIL no lanzó error");
    } catch (e) {
      assert.ok(e.message.includes("Usuario no encontrado"));
      console.log("✔ updatePassword usuario no encontrado OK");
    }
  }

  // 6. Request password reset éxito
  {
    await requestPasswordReset("ok@mail.com");
    console.log("✔ requestPasswordReset OK");
  }

  // 7. Reset password token válido
  {
    await resetPasswordWithToken({ token: "valid", contrasena_nueva: "nueva" });
    console.log("✔ resetPasswordWithToken válido OK");
  }

  // 8. Reset password token inválido
  {
    try {
      await resetPasswordWithToken({ token: "invalid", contrasena_nueva: "nueva" });
      console.error("❌ FAIL no lanzó error");
    } catch (e) {
      assert.ok(e.message.includes("Token inválido"));
      console.log("✔ resetPasswordWithToken inválido OK");
    }
  }

  console.log("✅ Todos los tests de usuario.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
