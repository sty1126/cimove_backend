// tests_manual/clientes.controller.test.js
// Ejecutar: node tests_manual/clientes.controller.test.js
import assert from "assert";

// ======================
// Fake Service (doble de prueba)
// ======================
const fakeService = {
  getClientes: async () => [{ id: 1, nombre: "Cliente Uno" }],
  getClientesNaturales: async () => [{ id: 2, nombre: "Cliente Natural" }],
  getClientesPorSede: async (idSede) =>
    idSede === "1" ? [{ id: 3, nombre: "Cliente Sede 1" }] : [],
  getClientesJuridicos: async () => [{ id: 4, nombre: "Cliente Jurídico" }],
  getClienteById: async (id) => {
    if (id === "404") throw new Error("Cliente no encontrado");
    return { id, nombre: "Cliente " + id };
  },
  getTiposCliente: async () => ["Natural", "Jurídico"],
  createCliente: async (data) => {
    if (!data || !data.nombre) throw new Error("Nombre es obligatorio");
    return { id: 5, ...data };
  },
  getClientesFormateados: async () => [{ id: 6, nombreCompleto: "Cliente Formateado" }],
  updateCliente: async (id, data) => {
    if (!data || !data.nombre) throw new Error("Datos inválidos");
    return { id, ...data };
  },
  deleteCliente: async (id) => ({ mensaje: `Cliente ${id} eliminado` }),
};

// ======================
// Controllers simulados con fakeService
// ======================
async function getClientes(req, res) {
  try {
    const clientes = await fakeService.getClientes();
    res.status(200).json(clientes);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getClientesNaturales(req, res) {
  try {
    const clientes = await fakeService.getClientesNaturales();
    res.status(200).json(clientes);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getClientesPorSede(req, res) {
  try {
    const { idSede } = req.params;
    if (!idSede) return res.status(400).json({ error: "Se requiere el ID de la sede" });
    const clientes = await fakeService.getClientesPorSede(idSede);
    res.status(200).json(clientes);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getClientesJuridicos(req, res) {
  try {
    const clientes = await fakeService.getClientesJuridicos();
    res.status(200).json(clientes);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function getClienteById(req, res) {
  try {
    const { id } = req.params;
    const cliente = await fakeService.getClienteById(id);
    res.status(200).json(cliente);
  } catch (e) {
    if (e.message === "Cliente no encontrado") {
      res.status(404).json({ error: e.message });
    } else {
      res.status(500).json({ error: e.message });
    }
  }
}

async function getTiposCliente(req, res) {
  try {
    const tipos = await fakeService.getTiposCliente();
    res.status(200).json(tipos);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function createCliente(req, res) {
  try {
    const result = await fakeService.createCliente(req.body);
    res.status(201).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function getClientesFormateados(req, res) {
  try {
    const clientes = await fakeService.getClientesFormateados();
    res.status(200).json(clientes);
  } catch (e) { res.status(500).json({ error: e.message }); }
}

async function updateCliente(req, res) {
  try {
    const { id } = req.params;
    const result = await fakeService.updateCliente(id, req.body);
    res.status(200).json(result);
  } catch (e) { res.status(400).json({ error: e.message }); }
}

async function deleteCliente(req, res) {
  try {
    const { id } = req.params;
    const result = await fakeService.deleteCliente(id);
    res.status(200).json(result);
  } catch (e) { res.status(500).json({ error: e.message }); }
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
  console.log("▶ Tests clientes.controller");

  // 1. GET clientes
  {
    const res = createResMock();
    await getClientes({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    console.log("✔ getClientes OK");
  }

  // 2. GET clientes naturales
  {
    const res = createResMock();
    await getClientesNaturales({}, res);
    assert.strictEqual(res.statusCode, 200);
    console.log("✔ getClientesNaturales OK");
  }

  // 3. GET clientes por sede (válido e inválido)
  {
    const res1 = createResMock();
    await getClientesPorSede({ params: {} }, res1);
    assert.strictEqual(res1.statusCode, 400);
    console.log("✔ getClientesPorSede inválido OK");

    const res2 = createResMock();
    await getClientesPorSede({ params: { idSede: "1" } }, res2);
    assert.strictEqual(res2.statusCode, 200);
    assert.strictEqual(res2.body[0].nombre, "Cliente Sede 1");
    console.log("✔ getClientesPorSede válido OK");
  }

  // 4. GET clientes jurídicos
  {
    const res = createResMock();
    await getClientesJuridicos({}, res);
    assert.strictEqual(res.statusCode, 200);
    console.log("✔ getClientesJuridicos OK");
  }

  // 5. GET cliente by ID
  {
    const res1 = createResMock();
    await getClienteById({ params: { id: "10" } }, res1);
    assert.strictEqual(res1.statusCode, 200);
    console.log("✔ getClienteById válido OK");

    const res2 = createResMock();
    await getClienteById({ params: { id: "404" } }, res2);
    assert.strictEqual(res2.statusCode, 404);
    console.log("✔ getClienteById no encontrado OK");
  }

  // 6. GET tipos cliente
  {
    const res = createResMock();
    await getTiposCliente({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.includes("Natural"));
    console.log("✔ getTiposCliente OK");
  }

  // 7. POST crear cliente
  {
    const res1 = createResMock();
    await createCliente({ body: { nombre: "Nuevo Cliente" } }, res1);
    assert.strictEqual(res1.statusCode, 201);
    console.log("✔ createCliente válido OK");

    const res2 = createResMock();
    await createCliente({ body: {} }, res2);
    assert.strictEqual(res2.statusCode, 400);
    console.log("✔ createCliente inválido OK");
  }

  // 8. GET clientes formateados
  {
    const res = createResMock();
    await getClientesFormateados({}, res);
    assert.strictEqual(res.statusCode, 200);
    console.log("✔ getClientesFormateados OK");
  }

  // 9. PUT update cliente
  {
    const res1 = createResMock();
    await updateCliente({ params: { id: "20" }, body: { nombre: "Actualizado" } }, res1);
    assert.strictEqual(res1.statusCode, 200);
    console.log("✔ updateCliente válido OK");

    const res2 = createResMock();
    await updateCliente({ params: { id: "21" }, body: {} }, res2);
    assert.strictEqual(res2.statusCode, 400);
    console.log("✔ updateCliente inválido OK");
  }

  // 10. DELETE cliente
  {
    const res = createResMock();
    await deleteCliente({ params: { id: "30" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(res.body.mensaje.includes("30"));
    console.log("✔ deleteCliente OK");
  }

  console.log("✅ Todos los tests de clientes.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
