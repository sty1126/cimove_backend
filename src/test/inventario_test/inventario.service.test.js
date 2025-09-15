import assert from "assert";


const fakeRepo = {
  fetchAll: async () => [{ id: 1, nombre: "Prod1" }],
  fetchById: async (id) => (id === "1" ? { id: 1 } : null),
  insert: async (data) => ({ ...data, id: 2 }),
  update: async (id, data) => ({ id, ...data })
};

// Service simulado
async function getInventario(_req, res) {
  try {
    const result = await fakeRepo.fetchAll();
    res.json(result);
  } catch {
    res.status(500).json({ message: "Error al obtener el inventario" });
  }
}

async function getInventarioById(req, res) {
  try {
    const result = await fakeRepo.fetchById(req.params.inventarioId);
    res.json(result);
  } catch {
    res.status(500).json({ message: "Error al obtener el inventario" });
  }
}

async function createInventario(req, res) {
  try {
    const result = await fakeRepo.insert(req.body);
    res.status(201).json(result);
  } catch {
    res.status(500).json({ message: "Error al registrar el inventario" });
  }
}

async function updateInventario(req, res) {
  try {
    const result = await fakeRepo.update(req.params.inventarioId, req.body);
    res.json(result);
  } catch {
    res.status(500).json({ message: "Error al actualizar el inventario" });
  }
}

// Mock response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
}

async function run() {
  console.log("▶ Tests inventario.service");

  {
    const res = createResMock();
    await getInventario({}, res);
    assert.strictEqual(res.body[0].id, 1);
    console.log("✔ getInventario OK");
  }

  {
    const res = createResMock();
    await getInventarioById({ params: { inventarioId: "1" } }, res);
    assert.strictEqual(res.body.id, 1);
    console.log("✔ getInventarioById OK");
  }

  {
    const res = createResMock();
    await createInventario({ body: { nombre: "NuevoProd" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.id, 2);
    console.log("✔ createInventario OK");
  }

  {
    const res = createResMock();
    await updateInventario({ params: { inventarioId: "7" }, body: { nombre: "X" } }, res);
    assert.strictEqual(res.body.id, "7");
    console.log("✔ updateInventario OK");
  }

  console.log("✅ Todos los tests de service pasaron");
}

run().catch((err) => console.error("❌ Error en tests service:", err));
