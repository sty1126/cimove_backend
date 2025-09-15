// tests_manual/usuario.controller.test.js
// Ejecutar: node tests_manual/usuario.controller.test.js
import assert from "assert";

// ======================
// Fake service (mocks)
// ======================
const service = {
  createUsuario: async (data) => ({ id: 1, ...data }),
  checkPassword: async (email, pass) => ({ id: 1, email }),
  updatePassword: async () => true,
  requestPasswordReset: async () => true,
  resetPasswordWithToken: async () => true,
};

// ======================
// Controllers simulados
// ======================
async function createUsuarioController(req, res) {
  try {
    const user = await service.createUsuario(req.body);
    res.status(201).json(user);
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function checkPasswordController(req, res) {
  const { email_usuario, contrasena_ingresada } = req.body;

  if (!email_usuario || !contrasena_ingresada) {
    return res.status(400).json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const result = await service.checkPassword(email_usuario, contrasena_ingresada);

    if (result === null) {
      return res.status(404).json({ error: "Usuario no encontrado o inactivo" });
    }

    if (result === false) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ message: "Contraseña correcta", user: result });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updatePasswordController(req, res) {
  try {
    await service.updatePassword(req.body);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function requestPasswordResetController(req, res) {
  try {
    await service.requestPasswordReset(req.body.email_usuario);
    res.json({
      message: "Si el correo electrónico existe, se ha enviado un enlace de recuperación.",
    });
  } catch {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function resetPasswordController(req, res) {
  try {
    await service.resetPasswordWithToken(req.body);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

// ======================
// Mock Express response
// ======================
function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) { this.statusCode = code; return this; };
  res.json = function (data) { this.body = data; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests usuario.controller");

  // 1. Crear usuario
  {
    const res = createResMock();
    await createUsuarioController({ body: { nombre: "Juan" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.nombre, "Juan");
    console.log("✔ createUsuarioController OK");
  }

  // 2. Check password correcto
  {
    const res = createResMock();
    await checkPasswordController({ body: { email_usuario: "a@b.com", contrasena_ingresada: "123" } }, res);
    assert.strictEqual(res.body.message, "Contraseña correcta");
    console.log("✔ checkPasswordController correcto OK");
  }

  // 3. Check password faltan datos
  {
    const res = createResMock();
    await checkPasswordController({ body: {} }, res);
    assert.strictEqual(res.statusCode, 400);
    console.log("✔ checkPasswordController falta datos OK");
  }

  // 4. Update password
  {
    const res = createResMock();
    await updatePasswordController({ body: { id: 1, nueva: "abc" } }, res);
    assert.strictEqual(res.body.message, "Contraseña actualizada correctamente");
    console.log("✔ updatePasswordController OK");
  }

  // 5. Request password reset
  {
    const res = createResMock();
    await requestPasswordResetController({ body: { email_usuario: "a@b.com" } }, res);
    assert.ok(res.body.message.includes("enlace de recuperación"));
    console.log("✔ requestPasswordResetController OK");
  }

  // 6. Reset password
  {
    const res = createResMock();
    await resetPasswordController({ body: { token: "123", nueva: "abc" } }, res);
    assert.strictEqual(res.body.message, "Contraseña actualizada correctamente");
    console.log("✔ resetPasswordController OK");
  }

  console.log("✅ Todos los tests de usuario.controller pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
