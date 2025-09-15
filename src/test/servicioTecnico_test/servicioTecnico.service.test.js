// tests_manual/serviciotecnico.service.test.js
// Ejecutar: node tests_manual/serviciotecnico.service.test.js
import assert from "assert";

// ======================
// Fake repository (mocks)
// ======================
const repo = {
  insertServicioTecnico: async (data) => ({ id: 1, ...data }),
  fetchServiciosTecnicos: async () => [{ id: 1, nombre_servicio: "Reparación" }],
  updateServicioTecnico: async (id, data) => (id === "99" ? false : true),
  fetchServicioTecnicoById: async (id) =>
    id === "99" ? null : { id, nombre_servicio: "Pantalla rota" },
};

// ======================
// Servicios simulados (igual a tu archivo real)
// ======================
async function createServicioTecnico(req, res) {
  try {
    const servicio = await repo.insertServicioTecnico(req.body);
    res.status(201).json({
      message: "Servicio técnico creado exitosamente",
      servicioTecnico: servicio,
    });
  } catch (error) {
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}

async function getServiciosTecnicos(req, res) {
  try {
    const servicios = await repo.fetchServiciosTecnicos();
    res.json(servicios);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function updateServicioTecnico(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await repo.updateServicioTecnico(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({ mensaje: "Servicio técnico actualizado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function getServicioTecnicoById(req, res) {
  try {
    const { id } = req.params;
    const servicio = await repo.fetchServicioTecnicoById(id);

    if (!servicio) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json(servicio);
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
  console.log("▶ Tests serviciotecnico.service");

  // 1. Crear servicio técnico
  {
    const res = createResMock();
    await createServicioTecnico({ body: { nombre_servicio: "Reparación" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.servicioTecnico.id, 1);
    console.log("✔ createServicioTecnico OK");
  }

  // 2. Obtener lista de servicios técnicos
  {
    const res = createResMock();
    await getServiciosTecnicos({}, res);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body[0].nombre_servicio, "Reparación");
    console.log("✔ getServiciosTecnicos OK");
  }

  // 3. Actualizar servicio técnico (existe)
  {
    const res = createResMock();
    await updateServicioTecnico({ params: { id: "1" }, body: {} }, res);
    assert.strictEqual(res.body.mensaje, "Servicio técnico actualizado correctamente");
    console.log("✔ updateServicioTecnico existente OK");
  }

  // 4. Actualizar servicio técnico (no existe)
  {
    const res = createResMock();
    await updateServicioTecnico({ params: { id: "99" }, body: {} }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error, "Servicio técnico no encontrado");
    console.log("✔ updateServicioTecnico no encontrado OK");
  }

  // 5. Obtener servicio técnico por ID (existe)
  {
    const res = createResMock();
    await getServicioTecnicoById({ params: { id: "1" } }, res);
    assert.strictEqual(res.body.id, "1");
    console.log("✔ getServicioTecnicoById existente OK");
  }

  // 6. Obtener servicio técnico por ID (no existe)
  {
    const res = createResMock();
    await getServicioTecnicoById({ params: { id: "99" } }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error, "Servicio técnico no encontrado");
    console.log("✔ getServicioTecnicoById no encontrado OK");
  }

  console.log("✅ Todos los tests de serviciotecnico.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});

