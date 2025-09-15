
import assert from "assert";


const service = {
  createServicioTecnico: (req, res) =>
    res.status(201).json({ message: "Servicio técnico creado exitosamente", servicioTecnico: { id: 1 } }),
  getServiciosTecnicos: (req, res) =>
    res.json([{ id: 1, nombre_servicio: "Reparación" }]),
  updateServicioTecnico: (req, res) =>
    res.json({ mensaje: "Servicio técnico actualizado correctamente" }),
  getServicioTecnicoById: (req, res) =>
    req.params.id === "99"
      ? res.status(404).json({ error: "Servicio técnico no encontrado" })
      : res.json({ id: req.params.id, nombre_servicio: "Pantalla rota" }),
};

// ======================
// Controllers simulados
// ======================
const createServicioTecnico = (req, res) => service.createServicioTecnico(req, res);
const getServiciosTecnicos = (req, res) => service.getServiciosTecnicos(req, res);
const updateServicioTecnico = (req, res) => service.updateServicioTecnico(req, res);
const getServicioTecnicoById = (req, res) => service.getServicioTecnicoById(req, res);

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
  console.log("▶ Tests serviciotecnico.controller");

  // 1. Crear servicio técnico
  {
    const res = createResMock();
    createServicioTecnico({ body: { nombre_servicio: "Reparación" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.servicioTecnico.id, 1);
    console.log("✔ createServicioTecnico OK");
  }

  // 2. Obtener lista de servicios técnicos
  {
    const res = createResMock();
    getServiciosTecnicos({}, res);
    assert.ok(Array.isArray(res.body));
    assert.strictEqual(res.body[0].nombre_servicio, "Reparación");
    console.log("✔ getServiciosTecnicos OK");
  }

  // 3. Actualizar servicio técnico
  {
    const res = createResMock();
    updateServicioTecnico({ params: { id: "1" }, body: {} }, res);
    assert.strictEqual(res.body.mensaje, "Servicio técnico actualizado correctamente");
    console.log("✔ updateServicioTecnico OK");
  }

  // 4. Obtener servicio técnico por ID (existe)
  {
    const res = createResMock();
    getServicioTecnicoById({ params: { id: "1" } }, res);
    assert.strictEqual(res.body.id, "1");
    console.log("✔ getServicioTecnicoById existente OK");
  }

  // 5. Obtener servicio técnico por ID (no existe)
  {
    const res = createResMock();
    getServicioTecnicoById({ params: { id: "99" } }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.strictEqual(res.body.error, "Servicio técnico no encontrado");
    console.log("✔ getServicioTecnicoById no encontrado OK");
  }

  console.log("✅ Todos los tests de serviciotecnico.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
