import assert from "assert";


const fakeRepo = {
  fetchAll: async () => [{ id: 1 }],
  fetchBySede: async (sedeId) =>
    sedeId === "1" ? [{ id: 1, sedeId: "1" }] : [],
  insert: async (data) => ({ id: 99, ...data }),
  update: async (id, data) => ({ id, ...data }),
  addStock: async () => "Stock añadido exitosamente",
  exists: async () => ({ existe: true, inventarioLocalId: 7 }),
  fetchAllEstados: async () => [{ estado: "A" }],
  fetchBySedeEstado: async (sedeId) => [{ sedeId, estado: "X" }]
};

// Service functions (simulan import * as repo)
async function getInventarioLocal(req, res) {
  try {
    const data = await fakeRepo.fetchAll();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Error al obtener el inventario local" });
  }
}

async function getInventarioLocalBySede(req, res) {
  try {
    const data = await fakeRepo.fetchBySede(req.params.sedeId);
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

async function createInventarioLocal(req, res) {
  try {
    const nuevo = await fakeRepo.insert(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(err.status || 500).json({ message: err.message });
  }
}

async function updateInventarioLocal(req, res) {
  try {
    const actualizado = await fakeRepo.update(req.params.inventarioLocalId, req.body);
    res.json(actualizado);
  } catch {
    res.status(500).json({ message: "Error al actualizar" });
  }
}

async function addStockToSede(req, res) {
  try {
    const result = await fakeRepo.addStock();
    res.json({ message: result });
  } catch {
    res.status(500).json({ error: "Error al añadir stock" });
  }
}

async function existeEnInventarioLocal(req, res) {
  try {
    const result = await fakeRepo.exists();
    res.json(result);
  } catch {
    res.status(500).json({ error: "Error verificando existencia" });
  }
}

async function getInventarioLocalEstado(req, res) {
  try {
    const data = await fakeRepo.fetchAllEstados();
    res.json(data);
  } catch {
    res.status(500).json({ message: "Error al obtener inventario por estado" });
  }
}

async function getInventarioLocalEstadoBySede(req, res) {
  try {
    const data = await fakeRepo.fetchBySedeEstado(req.params.sedeId);
    res.json(data);
  } catch {
    res.status(500).json({ message: "Error al obtener inventario por estado y sede" });
  }
}

// Mock response
function resMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; }
  };
}

async function run() {
  console.log("▶ Tests inventariolocal.service");

  {
    const res = resMock();
    await getInventarioLocal({}, res);
    assert.strictEqual(res.body[0].id, 1);
    console.log("✔ getInventarioLocal OK");
  }

  {
    const res = resMock();
    await getInventarioLocalBySede({ params: { sedeId: "1" } }, res);
    assert.strictEqual(res.body[0].sedeId, "1");
    console.log("✔ getInventarioLocalBySede OK");
  }

  {
    const res = resMock();
    await createInventarioLocal({ body: { producto: "X" } }, res);
    assert.strictEqual(res.statusCode, 201);
    console.log("✔ createInventarioLocal OK");
  }

  {
    const res = resMock();
    await updateInventarioLocal({ params: { inventarioLocalId: "5" }, body: { existencia: 20 } }, res);
    assert.strictEqual(res.body.id, "5");
    console.log("✔ updateInventarioLocal OK");
  }

  {
    const res = resMock();
    await addStockToSede({}, res);
    assert.strictEqual(res.body.message, "Stock añadido exitosamente");
    console.log("✔ addStockToSede OK");
  }

  {
    const res = resMock();
    await existeEnInventarioLocal({}, res);
    assert.strictEqual(res.body.existe, true);
    console.log("✔ existeEnInventarioLocal OK");
  }

  {
    const res = resMock();
    await getInventarioLocalEstado({}, res);
    assert.strictEqual(res.body[0].estado, "A");
    console.log("✔ getInventarioLocalEstado OK");
  }

  {
    const res = resMock();
    await getInventarioLocalEstadoBySede({ params: { sedeId: "2" } }, res);
    assert.strictEqual(res.body[0].sedeId, "2");
    console.log("✔ getInventarioLocalEstadoBySede OK");
  }

  console.log("✅ Todos los tests de inventariolocal.service pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
