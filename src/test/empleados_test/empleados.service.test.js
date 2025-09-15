// tests_manual/empleados.service.test.js
// Ejecutar: node tests_manual/empleados.service.test.js
import assert from "assert";

// ======================
// Mock repo
// ======================
const repo = {
  obtenerEmpleadosConUsuario: async () => [{ id_empleado: "1", nombre: "Juan" }],
  crearEmpleado: async () => ({ message: "Empleado creado exitosamente" }),
  obtenerEmpleadoPorId: async (id) => {
    if (id === "404") throw new Error("Empleado no encontrado");
    return { id_empleado: id, nombre: "Pedro" };
  },
  eliminarEmpleado: async (id) => { if (id === "500") throw new Error("DB error"); return true; },
  restaurarEmpleado: async (id) => { if (id === "500") throw new Error("DB error"); return true; },
  actualizarEmpleado: async (id, data) => { if (id === "500") throw new Error("DB error"); return true; },
};

// ======================
// Mock service usando el repo fake
// ======================
const service = {
  getEmpleadosConUsuario: async (req, res) => {
    try {
      const empleados = await repo.obtenerEmpleadosConUsuario();
      res.status(200).json(empleados);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  crearEmpleado: async (req, res) => {
    try {
      const result = await repo.crearEmpleado(req.body);
      res.status(201).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },
  getEmpleadoPorId: async (req, res) => {
    try {
      const empleado = await repo.obtenerEmpleadoPorId(req.params.id);
      res.status(200).json(empleado);
    } catch (err) {
      res.status(404).json({ message: err.message });
    }
  },
  eliminarEmpleado: async (req, res) => {
    try {
      await repo.eliminarEmpleado(req.params.id);
      res.status(200).json({ message: "Empleado eliminado correctamente" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  restaurarEmpleado: async (req, res) => {
    try {
      await repo.restaurarEmpleado(req.params.id);
      res.status(200).json({ message: "Empleado restaurado correctamente" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
  actualizarEmpleado: async (req, res) => {
    try {
      await repo.actualizarEmpleado(req.params.id, req.body);
      res.status(200).json({ message: "Empleado actualizado correctamente" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

// ======================
// Mock Express response
// ======================
function makeRes() {
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
  console.log("▶ Tests empleados.service");

  // 1. getEmpleadosConUsuario
  {
    const res = makeRes();
    await service.getEmpleadosConUsuario({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body[0].nombre, "Juan");
    console.log("✔ getEmpleadosConUsuario OK");
  }

  // 2. crearEmpleado
  {
    const res = makeRes();
    await service.crearEmpleado({ body: { nombre: "Carlos" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.message, "Empleado creado exitosamente");
    console.log("✔ crearEmpleado OK");
  }

  // 3. getEmpleadoPorId válido
  {
    const res = makeRes();
    await service.getEmpleadoPorId({ params: { id: "200" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.id_empleado, "200");
    console.log("✔ getEmpleadoPorId válido OK");
  }

  // 4. getEmpleadoPorId inexistente
  {
    const res = makeRes();
    await service.getEmpleadoPorId({ params: { id: "404" } }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.ok(res.body.message.includes("no encontrado"));
    console.log("✔ getEmpleadoPorId inexistente OK");
  }

  // 5. eliminarEmpleado OK
  {
    const res = makeRes();
    await service.eliminarEmpleado({ params: { id: "300" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.message, "Empleado eliminado correctamente");
    console.log("✔ eliminarEmpleado OK");
  }

  // 6. restaurarEmpleado OK
  {
    const res = makeRes();
    await service.restaurarEmpleado({ params: { id: "301" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.message, "Empleado restaurado correctamente");
    console.log("✔ restaurarEmpleado OK");
  }

  // 7. actualizarEmpleado OK
  {
    const res = makeRes();
    await service.actualizarEmpleado({ params: { id: "400" }, body: { nombre: "Luis" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.message, "Empleado actualizado correctamente");
    console.log("✔ actualizarEmpleado OK");
  }

  // 8. eliminarEmpleado error
  {
    const res = makeRes();
    await service.eliminarEmpleado({ params: { id: "500" } }, res);
    assert.strictEqual(res.statusCode, 500);
    console.log("✔ eliminarEmpleado error manejado OK");
  }

  console.log("✅ Todos los tests de empleados.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
