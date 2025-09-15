// tests_manual/tiposProveedor.controllers.test.js
import assert from "assert";

// ======================
// Fake Service
// ======================
// Simula las funciones del servicio sin llamar a la lógica real
const fakeService = {
  // Simula la obtención de tipos de proveedor
  getTiposProveedor: async () => [
    { id_tipoproveedor: 1, nombre_tipoproveedor: "Fabricante" },
    { id_tipoproveedor: 2, nombre_tipoproveedor: "Distribuidor" },
  ],
  // Simula la creación de un tipo de proveedor, lanzando error si el nombre falta
  createTipoProveedor: async (data) => {
    if (!data || !data.nombre_tipoproveedor) {
      throw new Error("El nombre es requerido");
    }
    return { id_tipoproveedor: 3, ...data }; // Devuelve el tipo creado simulado
  },
};

// ======================
// Controllers simulados con fakeService
// ======================
// Simula el controlador para obtener tipos de proveedor
async function getTiposProveedorController(req, res) {
  try {
    const tipos = await fakeService.getTiposProveedor(); // Llama al servicio simulado
    res.json(tipos); // Responde con los tipos obtenidos
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" }); // Maneja errores del servidor
  }
}

// Simula el controlador para crear un tipo de proveedor
async function createTipoProveedorController(req, res) {
  try {
    const tipo = await fakeService.createTipoProveedor(req.body); // Llama al servicio simulado con datos del body
    res.status(201).json(tipo); // Responde con el tipo creado y código 201
  } catch (error) {
    res.status(400).json({ error: error.message }); // Maneja errores de validación (código 400)
  }
}

// ======================
// Mock Express response
// ======================
// Crea un objeto mock para simular la respuesta de Express (res)
function createResMock() {
  const res = {}; // Objeto de respuesta simulado
  res.statusCode = 200; // Código de estado HTTP por defecto
  res.body = null; // Cuerpo de la respuesta simulado
  // Método status para simular el establecimiento del código de estado
  res.status = function (code) { this.statusCode = code; return this; };
  // Método json para simular el envío de una respuesta JSON
  res.json = function (data) { this.body = data; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposProveedor.controllers");

  // Test 1: getTiposProveedorController
  // Verifica que el controlador responde con los tipos de proveedor y código 200
  {
    const res = createResMock(); // Crea un mock de respuesta
    await getTiposProveedorController({}, res); // Llama al controlador sin petición (req)
    assert.strictEqual(res.statusCode, 200); // Verifica que el código de estado es 200
    assert.ok(Array.isArray(res.body)); // Verifica que el cuerpo de la respuesta es un array
    assert.strictEqual(res.body[0].nombre_tipoproveedor, "Fabricante"); // Verifica un dato específico del array
    console.log("✔ getTiposProveedorController OK");
  }

  // Test 2: createTipoProveedorController - Caso válido
  // Verifica que el controlador crea un tipo de proveedor y responde con 201
  {
    const res = createResMock();
    // Simula una petición con un cuerpo válido
    await createTipoProveedorController({ body: { nombre_tipoproveedor: "Logística" } }, res);
    assert.strictEqual(res.statusCode, 201); // Verifica código 201 (Creado)
    assert.strictEqual(res.body.nombre_tipoproveedor, "Logística"); // Verifica que el nombre se reflejó en la respuesta
    console.log("✔ createTipoProveedorController válido OK");
  }
;
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});