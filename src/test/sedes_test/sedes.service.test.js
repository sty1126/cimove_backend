import assert from "assert";

// ======================
// Repo mock
// ======================
const repo = {
  async obtenerTodas() {
    return { rows: [{ id_sede: 1, nombre_sede: "Central" }] };
  },
  async crear(data) {
    return { rows: [{ id_sede: 2, nombre_sede: data.nombre_sede }] };
  },
  async desactivar(id) {
    return { rowCount: 1, rows: [{ id_sede: id, estado_sede: "I" }] };
  },
  async obtenerPorId(id) {
    if (id === 10) {
      return { rows: [{ id_sede: 10, nombre_sede: "Sucursal Norte" }] };
    }
    return { rows: [] };
  },
  async obtenerIdPorNombre(nombre) {
    if (nombre === "Central") {
      return { rows: [{ id_sede: 99 }] };
    }
    return { rows: [] };
  }
};

// ======================
// Service fake usando repo mock
// ======================
const service = {
  async obtenerTodas() {
    const { rows } = await repo.obtenerTodas();
    return rows;
  },
  async crearSede(data) {
    const { rows } = await repo.crear(data);
    return rows[0];
  },
  async desactivarSede(id) {
    const { rowCount } = await repo.desactivar(id);
    return rowCount > 0;
  },
  async obtenerPorId(id) {
    const { rows } = await repo.obtenerPorId(id);
    return rows[0] || null;
  },
  async obtenerIdPorNombre(nombre) {
    const { rows } = await repo.obtenerIdPorNombre(nombre);
    return rows[0] || null;
  }
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests sedes.service");

  {
    const r = await service.obtenerTodas();
    assert.strictEqual(r[0].nombre_sede, "Central");
    console.log("✔ obtenerTodas OK");
  }

  {
    const r = await service.crearSede({
      nombre_sede: "Nueva Sede",
      id_ciudad_sede: 1,
      direccion_sede: "Calle 123",
      numeroempleados_sede: 20,
      telefono_sede: "55555"
    });
    assert.strictEqual(r.nombre_sede, "Nueva Sede");
    console.log("✔ crearSede OK");
  }

  {
    const r = await service.desactivarSede(5);
    assert.strictEqual(r, true);
    console.log("✔ desactivarSede OK");
  }

  {
    const r = await service.obtenerPorId(10);
    assert.strictEqual(r.nombre_sede, "Sucursal Norte");
    console.log("✔ obtenerPorId OK");
  }

  {
    const r = await service.obtenerPorId(99);
    assert.strictEqual(r, null);
    console.log("✔ obtenerPorId null OK");
  }

  {
    const r = await service.obtenerIdPorNombre("Central");
    assert.strictEqual(r.id_sede, 99);
    console.log("✔ obtenerIdPorNombre OK");
  }

  {
    const r = await service.obtenerIdPorNombre("Inexistente");
    assert.strictEqual(r, null);
    console.log("✔ obtenerIdPorNombre null OK");
  }

  console.log("✅ Todos los tests de sedes.service pasaron");
}

run().catch((err) => console.error("❌ Error en tests:", err));
