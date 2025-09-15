import assert from "assert";


const fakeService = {
  getInventarioLocal: (req, res) => res.json([{ id: 1 }]),
  getInventarioLocalBySede: (req, res) =>
    req.params.sedeId == 1
      ? res.json([{ id: 1, sede: 1 }])
      : res.status(404).json({ message: "No hay inventario en esta sede" }),
  createInventarioLocal: (req, res) => res.status(201).json({ ...req.body, id: 2 }),
  updateInventarioLocal: (req, res) => res.json({ id: req.params.inventarioLocalId, ...req.body }),
  addStockToSede: (req, res) => res.json({ message: "Stock añadido" }),
  existeEnInventarioLocal: (req, res) => res.json(true),
  getInventarioLocalEstado: (req, res) => res.json([{ estado: "A" }]),
  getInventarioLocalEstadoBySede: (req, res) => res.json([{ sede: req.params.sedeId, estado: "A" }])
};

// Controllers simulados
const getInventarioLocal = (req, res) => fakeService.getInventarioLocal(req, res);
const getInventarioLocalBySede = (req, res) => fakeService.getInventarioLocalBySede(req, res);
const createInventarioLocal = (req, res) => fakeService.createInventarioLocal(req, res);
const updateInventarioLocal = (req, res) => fakeService.updateInventarioLocal(req, res);
const addStockToSede = (req, res) => fakeService.addStockToSede(req, res);
const existeEnInventarioLocal = (req, res) => fakeService.existeEnInventarioLocal(req, res);
const getInventarioLocalEstado = (req, res) => fakeService.getInventarioLocalEstado(req, res);
const getInventarioLocalEstadoBySede = (req, res) => fakeService.getInventarioLocalEstadoBySede(req, res);

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
  console.log("▶ Tests inventariolocal.controllers");

  {
    const res = createResMock();
    await getInventarioLocal({}, res);
    assert.strictEqual(res.body[0].id, 1);
    console.log("✔ getInventarioLocal OK");
  }

  {
    const res = createResMock();
    await getInventarioLocalBySede({ params: { sedeId: 1 } }, res);
    assert.strictEqual(res.body[0].sede, 1);
    console.log("✔ getInventarioLocalBySede OK");
  }

  {
    const res = createResMock();
    await getInventarioLocalBySede({ params: { sedeId: 999 } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getInventarioLocalBySede Not Found OK");
  }

  {
    const res = createResMock();
    await createInventarioLocal({ body: { nombre: "Nuevo" } }, res);
    assert.strictEqual(res.statusCode, 201);
    console.log("✔ createInventarioLocal OK");
  }

  {
    const res = createResMock();
    await updateInventarioLocal({ params: { inventarioLocalId: "7" }, body: { nombre: "X" } }, res);
    assert.strictEqual(res.body.id, "7");
    console.log("✔ updateInventarioLocal OK");
  }

  {
    const res = createResMock();
    await addStockToSede({ params: { idProducto: "1", idSede: "2" }, body: { cantidad: 5 } }, res);
    assert.strictEqual(res.body.message, "Stock añadido");
    console.log("✔ addStockToSede OK");
  }

  {
    const res = createResMock();
    await existeEnInventarioLocal({ params: { idProducto: "1", idSede: "2" } }, res);
    assert.strictEqual(res.body, true);
    console.log("✔ existeEnInventarioLocal OK");
  }

  {
    const res = createResMock();
    await getInventarioLocalEstado({}, res);
    assert.strictEqual(res.body[0].estado, "A");
    console.log("✔ getInventarioLocalEstado OK");
  }

  {
    const res = createResMock();
    await getInventarioLocalEstadoBySede({ params: { sedeId: "3" } }, res);
    assert.strictEqual(res.body[0].sede, "3");
    console.log("✔ getInventarioLocalEstadoBySede OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch((err) => console.error("❌ Error en tests controllers:", err));
