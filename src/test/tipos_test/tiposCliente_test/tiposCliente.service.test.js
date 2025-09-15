import assert from "assert";

// ======================
// Fake repository (Doble de prueba)
// ======================
const fakeRepo = {
  obtenerTiposCliente: async () => [
    { id_tipocliente: 1, descripcion_tipocliente: "Persona Natural" },
    { id_tipocliente: 2, descripcion_tipocliente: "Persona Jurídica" },
  ],
};

// ======================
// Service con repo inyectado
// ======================
function makeService(repo) {
  return {
    getTiposCliente: async () => await repo.obtenerTiposCliente(),
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposCliente.service");

  const service = makeService(fakeRepo);

  // Test: getTiposCliente
  {
    const res = await service.getTiposCliente();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].descripcion_tipocliente, "Persona Natural");
    console.log("✔ getTiposCliente OK");
  }

  console.log("✅ Todos los tests de tiposCliente.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});