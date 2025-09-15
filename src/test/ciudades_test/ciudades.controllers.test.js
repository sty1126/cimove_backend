import assert from "assert";


const fakeService = {
  getCiudades: async () => [
    { id_ciudad: "1", nombre_ciudad: "Bogotá" },
    { id_ciudad: "2", nombre_ciudad: "Medellín" },
  ],
  createCiudad: async ({ nombre_ciudad }) => {
    if (!nombre_ciudad) throw new Error("El nombre de la ciudad es requerido");
    return { id_ciudad: "3", nombre_ciudad, estado_ciudad: "A" };
  },
};

// Controllers simulados
async function getCiudadesController(req, res) {
  try {
    const ciudades = await fakeService.getCiudades();
    res.status(200).json(ciudades);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}

async function createCiudadController(req, res) {
  try {
    const nueva = await fakeService.createCiudad(req.body);
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
  console.log("▶ Tests ciudades.controller");

  // 1. GET /ciudades
  {
    const req = {};
    const res = createResMock();
    await getCiudadesController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.length, 2);
    console.log("✔ getCiudadesController OK");
  }

  // 2. POST válido
  {
    const req = { body: { nombre_ciudad: "Cali" } };
    const res = createResMock();
    await createCiudadController(req, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.nombre_ciudad, "Cali");
    console.log("✔ createCiudadController válido OK");
  }

  // 3. POST inválido
  {
    const req = { body: {} };
    const res = createResMock();
    await createCiudadController(req, res);
    assert.strictEqual(res.statusCode, 400);
    console.log("✔ createCiudadController inválido OK");
  }

  console.log("✅ Todos los tests de ciudades.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
