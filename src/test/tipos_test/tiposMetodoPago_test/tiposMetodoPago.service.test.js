
import assert from "assert";


const fakeRepo = {
  obtenerTiposMetodoPago: async () => [
    { id: 1, nombre: "Tarjeta" },
    { id: 2, nombre: "Efectivo" },
  ],
  insertarTipoMetodoPago: async (nombre, comision, recepcion) => { },
  actualizarTipoMetodoPago: async (id, nombre, comision, recepcion) => { },
  inhabilitarTipoMetodoPago: async (id) => { },
};

// ======================
// Service con repo inyectado
// ======================
function makeService(repo) {
  return {
    getTiposMetodoPago: async () => await repo.obtenerTiposMetodoPago(),

    crearTipoMetodoPago: async (data) => {
      const { nombre, comision, recepcion } = data;
      if (!nombre || comision == null || recepcion == null) {
        throw new Error("Todos los campos son obligatorios");
      }
      await repo.insertarTipoMetodoPago(nombre, comision, recepcion);
    },

    actualizarTipoMetodoPago: async (id, data) => {
      const { nombre, comision, recepcion } = data;
      if (!nombre || comision == null || recepcion == null) {
        throw new Error("Todos los campos son obligatorios");
      }
      await repo.actualizarTipoMetodoPago(id, nombre, comision, recepcion);
    },

    eliminarTipoMetodoPago: async (id) => {
      await repo.inhabilitarTipoMetodoPago(id);
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposMetodoPago.service");

  const service = makeService(fakeRepo);

  // Test 1: getTiposMetodoPago
  {
    const res = await service.getTiposMetodoPago();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre, "Tarjeta");
    console.log("✔ getTiposMetodoPago OK");
  }

  // Test 2: crearTipoMetodoPago - Caso válido
  {
    await service.crearTipoMetodoPago({ nombre: "Transferencia", comision: 1.2, recepcion: true });
    console.log("✔ crearTipoMetodoPago válido OK");
  }

  // Test 3: crearTipoMetodoPago - Caso inválido (campos faltantes)
  {
    let errorCaught = false;
    try {
      await service.crearTipoMetodoPago({});
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("obligatorios"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ crearTipoMetodoPago inválido OK");
  }

  // Test 4: actualizarTipoMetodoPago - Caso válido
  {
    await service.actualizarTipoMetodoPago(1, { nombre: "Nuevo Nombre", comision: 0.8, recepcion: false });
    console.log("✔ actualizarTipoMetodoPago válido OK");
  }

  // Test 5: actualizarTipoMetodoPago - Caso inválido (campos faltantes)
  {
    let errorCaught = false;
    try {
      await service.actualizarTipoMetodoPago(1, {});
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("obligatorios"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ actualizarTipoMetodoPago inválido OK");
  }

  // Test 6: eliminarTipoMetodoPago
  {
    await service.eliminarTipoMetodoPago(1);
    console.log("✔ eliminarTipoMetodoPago OK");
  }

  console.log("✅ Todos los tests de tiposMetodoPago.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});