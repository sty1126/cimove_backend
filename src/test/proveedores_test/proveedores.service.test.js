// tests_manual/proveedores.service.test.js
import assert from "assert";

// ======================
// Repo mock
// ======================
function makeRepoMock() {
  return {
    obtenerTodos: async () => ({
      rows: [{ id_proveedor: 1, nombre_proveedor: "Proveedor 1" }],
    }),
    obtenerPorId: async (id) => ({
      rows: [{ id_proveedor: id, nombre_proveedor: "Proveedor X" }],
    }),
    obtenerTipos: async () => ({
      rows: [
        { id_tipoproveedor: 1, nombre_tipoproveedor: "Mayorista" },
        { id_tipoproveedor: 2, nombre_tipoproveedor: "Minorista" },
      ],
    }),
    crearTipo: async (nombre) => ({
      rows: [{ id_tipoproveedor: 3, nombre_tipoproveedor: nombre }],
    }),
    proveedorExiste: async (id) => {
      if (id === 99) {
        return { rows: [{ id_proveedor: 99 }] }; // simula ya existente
      }
      return { rows: [] };
    },
    crearProveedor: async (data) => ({
      rows: [{ id_proveedor: data.id_proveedor, nombre_proveedor: data.nombre_proveedor }],
    }),
    actualizarProveedor: async (id, datos) => ({
      rows: [{ id_proveedor: id, ...datos }],
    }),
    eliminarProveedor: async (id) => ({
      rows: [{ id_proveedor: id, estado_proveedor: "I" }],
    }),
  };
}

// ======================
// Service con repo inyectado
// ======================
function makeService(repo) {
  return {
    async obtenerTodos() {
      const { rows } = await repo.obtenerTodos();
      return rows;
    },
    async obtenerPorId(id) {
      const { rows } = await repo.obtenerPorId(id);
      return rows[0] || null;
    },
    async obtenerTipos() {
      const { rows } = await repo.obtenerTipos();
      return rows;
    },
    async crearTipo(nombre) {
      const { rows } = await repo.crearTipo(nombre);
      return rows[0];
    },
    async crearProveedor(data) {
      const existe = await repo.proveedorExiste(data.id_proveedor);
      if (existe.rows.length > 0) throw new Error("El proveedor ya está registrado");
      const { rows } = await repo.crearProveedor(data);
      return rows[0];
    },
    async actualizarProveedor(id, datos) {
      const { rows } = await repo.actualizarProveedor(id, datos);
      return rows[0] || null;
    },
    async eliminarProveedor(id) {
      const { rows } = await repo.eliminarProveedor(id);
      return rows[0] || null;
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests proveedores.service");

  const repo = makeRepoMock();
  const service = makeService(repo);

  // 1. obtenerTodos
  {
    const res = await service.obtenerTodos();
    assert.strictEqual(res[0].nombre_proveedor, "Proveedor 1");
    console.log("✔ obtenerTodos OK");
  }

  // 2. obtenerPorId
  {
    const res = await service.obtenerPorId(10);
    assert.strictEqual(res.id_proveedor, 10);
    console.log("✔ obtenerPorId OK");
  }

  // 3. obtenerTipos
  {
    const res = await service.obtenerTipos();
    assert.strictEqual(res.length, 2);
    console.log("✔ obtenerTipos OK");
  }

  // 4. crearTipo
  {
    const res = await service.crearTipo("Exportador");
    assert.strictEqual(res.nombre_tipoproveedor, "Exportador");
    console.log("✔ crearTipo OK");
  }

  // 5. crearProveedor nuevo
  {
    const res = await service.crearProveedor({ id_proveedor: 50, nombre_proveedor: "Nuevo Prov" });
    assert.strictEqual(res.id_proveedor, 50);
    console.log("✔ crearProveedor OK");
  }

  // 6. crearProveedor duplicado debe fallar
  {
    let errorCaught = false;
    try {
      await service.crearProveedor({ id_proveedor: 99, nombre_proveedor: "Duplicado" });
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("ya está registrado"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ crearProveedor duplicado error OK");
  }

  // 7. actualizarProveedor
  {
    const res = await service.actualizarProveedor(60, { nombre_proveedor: "Prov Actualizado" });
    assert.strictEqual(res.id_proveedor, 60);
    assert.strictEqual(res.nombre_proveedor, "Prov Actualizado");
    console.log("✔ actualizarProveedor OK");
  }

  // 8. eliminarProveedor
  {
    const res = await service.eliminarProveedor(70);
    assert.strictEqual(res.estado_proveedor, "I");
    console.log("✔ eliminarProveedor OK");
  }

  console.log("✅ Todos los tests de proveedores.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
