import assert from "assert";

const fakeRepo = {
  fetchActiveTiposUsuario: async () => [
    { id_tipousuario: 1, nombre_tipousuario: "Administrador", estado_tipousuario: 'A' },
    { id_tipousuario: 2, nombre_tipousuario: "Empleado", estado_tipousuario: 'A' },
  ],
};


function makeService(repo) {
  return {
    getActiveTiposUsuario: async () => {
      return await repo.fetchActiveTiposUsuario();
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposUsuario.service");

  const service = makeService(fakeRepo);

  // Test: getActiveTiposUsuario
  {
    const res = await service.getActiveTiposUsuario();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre_tipousuario, "Administrador");
    assert.strictEqual(res[1].estado_tipousuario, 'A');
    console.log("✔ getActiveTiposUsuario OK");
  }

  console.log("✅ Todos los tests de tiposUsuario.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});