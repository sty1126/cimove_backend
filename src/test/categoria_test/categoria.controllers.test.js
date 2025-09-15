
import assert from "assert";

// Fake service
const fakeService = {
  getCategorias: async () => [
    { id_categoria: 1, descripcion_categoria: "Accesorios" },
    { id_categoria: 2, descripcion_categoria: "Fundas" },
  ],
  createCategoria: async ({ descripcion_categoria }) => {
    if (!descripcion_categoria) throw new Error("La descripción de la categoría es obligatoria");
    return { id_categoria: 3, descripcion_categoria, estado_categoria: "A" };
  },
};

// Controllers simulados
async function getCategoriasController(req, res) {
  try {
    const cats = await fakeService.getCategorias();
    res.status(200).json(cats);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createCategoriaController(req, res) {
  try {
    const nueva = await fakeService.createCategoria(req.body);
    res.status(201).json(nueva);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
}

// Mock de response Express
function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
}

async function run() {
  console.log("▶ Tests categoria.controller");

  // 1. GET /categorias
  {
    const req = {};
    const res = createResMock();
    await getCategoriasController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.length, 2);
    console.log("✔ getCategoriasController OK");
  }

  // 2. POST válido
  {
    const req = { body: { descripcion_categoria: "Electrónica" } };
    const res = createResMock();
    await createCategoriaController(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.descripcion_categoria, "Electrónica");
    console.log("✔ createCategoriaController válido OK");
  }

  // 3. POST inválido
  {
    const req = { body: {} };
    const res = createResMock();
    await createCategoriaController(req, res);
    assert.strictEqual(res.statusCode, 400);
    console.log("✔ createCategoriaController inválido OK");
  }

  console.log("✅ Todos los tests de categoria.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
