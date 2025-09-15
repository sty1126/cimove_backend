
import assert from "assert";


const fakeService = {
  getTiposCliente: async () => [
    { id_tipocliente: 1, descripcion_tipocliente: "Persona Natural" },
    { id_tipocliente: 2, descripcion_tipocliente: "Persona Jurídica" },
  ],
};


async function getTiposClienteController(req, res) {
  try {
    const tipos = await fakeService.getTiposCliente();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
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
  console.log("▶ Tests tiposCliente.controllers");

  // Test: getTiposClienteController
  {
    const res = createResMock();
    await getTiposClienteController({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body[0].descripcion_tipocliente, "Persona Natural");
    console.log("✔ getTiposClienteController OK");
  }

  console.log("✅ Todos los tests de tiposCliente.controllers pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});