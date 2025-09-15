import assert from "assert";


const fakeService = {
  getActiveTiposUsuario: async () => [
    { id_tipousuario: 1, nombre_tipousuario: "Administrador" },
    { id_tipousuario: 2, nombre_tipousuario: "Empleado" },
  ],
};

// Controller simulado 

async function getTiposUsuario(req, res) {
  try {
    const tiposUsuario = await fakeService.getActiveTiposUsuario();
    res.json(tiposUsuario);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor al obtener tipos de usuario" });
  }
}


// Mock Express response

function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposUsuario.controllers");

  // Test: getTiposUsuario
  {
    const res = createResMock();
    await getTiposUsuario({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body[0].nombre_tipousuario, "Administrador");
    console.log("✔ getTiposUsuario OK");
  }

  console.log("✅ Todos los tests de tiposUsuario.controllers pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});