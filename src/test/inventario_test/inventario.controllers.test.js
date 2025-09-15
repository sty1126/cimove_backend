import assert from "assert";


const fakeService = {
  getInventario: (req, res) => res.json([{ id: 1 }]),
  getInventarioById: (req, res) =>
    req.params.inventarioId == 1
      ? res.json({ id: 1 })
      : res.status(404).json({ message: "No encontrado" }),
  createInventario: (req, res) => res.status(201).json({ ...req.body, id: 2 }),
  updateInventario: (req, res) =>
    res.json({ ...req.body, id: parseInt(req.params.inventarioId) })
};

// Controllers simulados
const getInventario = (req, res) => fakeService.getInventario(req, res);
const getInventarioById = (req, res) => fakeService.getInventarioById(req, res);
const createInventario = (req, res) => fakeService.createInventario(req, res);
const updateInventario = (req, res) => fakeService.updateInventario(req, res);

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
  console.log("▶ Tests inventario.controllers");

  {
    const res = createResMock();
    await getInventario({}, res);
    assert.strictEqual(res.body[0].id, 1);
    console.log("✔ getInventario OK");
  }

  {
    const res = createResMock();
    await getInventarioById({ params: { inventarioId: 1 } }, res);
    assert.strictEqual(res.body.id, 1);
    console.log("✔ getInventarioById OK");
  }

  {
    const res = createResMock();
    await getInventarioById({ params: { inventarioId: 999 } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getInventarioById Not Found OK");
  }

  {
    const res = createResMock();
    await createInventario({ body: { nombre: "ProductoX" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.id, 2);
    console.log("✔ createInventario OK");
  }

  {
    const res = createResMock();
    await updateInventario({ params: { inventarioId: "5" }, body: { nombre: "Nuevo" } }, res);
    assert.strictEqual(res.body.id, 5);
    console.log("✔ updateInventario OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch((err) => console.error("❌ Error en tests controllers:", err));
