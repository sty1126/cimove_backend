// tests_manual/empleados.controller.test.js
// Ejecutar: node tests_manual/empleados.controller.test.js
import assert from "assert";

// ======================
// Fake service (mocks)
// ======================
const service = {
  getEmpleadosConUsuario: (req, res) => res.json({ ok: "getEmpleadosConUsuario" }),
  crearEmpleado: (req, res) => res.status(201).json({ ok: "crearEmpleado" }),
  getEmpleadoPorId: (req, res) => res.json({ ok: "getEmpleadoPorId", id: req.params.id }),
  eliminarEmpleado: (req, res) => res.json({ ok: "eliminarEmpleado", id: req.params.id }),
  restaurarEmpleado: (req, res) => res.json({ ok: "restaurarEmpleado", id: req.params.id }),
  actualizarEmpleado: (req, res) => res.json({ ok: "actualizarEmpleado", id: req.params.id, body: req.body }),
};

// ======================
// Controllers simulados
// ======================
const getEmpleadosConUsuarioController = (req, res) => service.getEmpleadosConUsuario(req, res);
const crearEmpleadoController = (req, res) => service.crearEmpleado(req, res);
const getEmpleadoPorIdController = (req, res) => service.getEmpleadoPorId(req, res);
const eliminarEmpleadoController = (req, res) => service.eliminarEmpleado(req, res);
const restaurarEmpleadoController = (req, res) => service.restaurarEmpleado(req, res);
const actualizarEmpleadoController = (req, res) => service.actualizarEmpleado(req, res);

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
  console.log("▶ Tests empleados.controller");

  // 1. GET empleados con usuario
  {
    const res = createResMock();
    getEmpleadosConUsuarioController({}, res);
    assert.strictEqual(res.body.ok, "getEmpleadosConUsuario");
    console.log("✔ getEmpleadosConUsuarioController OK");
  }

  // 2. Crear empleado
  {
    const res = createResMock();
    crearEmpleadoController({ body: { nombre: "Juan" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.ok, "crearEmpleado");
    console.log("✔ crearEmpleadoController OK");
  }

  // 3. Get empleado por ID
  {
    const res = createResMock();
    getEmpleadoPorIdController({ params: { id: "10" } }, res);
    assert.strictEqual(res.body.id, "10");
    console.log("✔ getEmpleadoPorIdController OK");
  }

  // 4. Eliminar empleado
  {
    const res = createResMock();
    eliminarEmpleadoController({ params: { id: "20" } }, res);
    assert.strictEqual(res.body.id, "20");
    console.log("✔ eliminarEmpleadoController OK");
  }

  // 5. Restaurar empleado
  {
    const res = createResMock();
    restaurarEmpleadoController({ params: { id: "30" } }, res);
    assert.strictEqual(res.body.id, "30");
    console.log("✔ restaurarEmpleadoController OK");
  }

  // 6. Actualizar empleado
  {
    const res = createResMock();
    actualizarEmpleadoController({ params: { id: "40" }, body: { nombre: "Carlos" } }, res);
    assert.strictEqual(res.body.id, "40");
    assert.strictEqual(res.body.body.nombre, "Carlos");
    console.log("✔ actualizarEmpleadoController OK");
  }

  console.log("✅ Todos los tests de empleados.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
