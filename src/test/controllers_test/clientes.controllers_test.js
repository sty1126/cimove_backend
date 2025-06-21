import {
  getClientes,
  getClientesNaturales,
  getClientesJuridicos,
  getClienteById,
} from "../../controllers/clientes.controllers.js";

// ========== MOCKS ==========

// Generador de mock de respuesta
function createMockRes() {
  return {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.data = payload;
    },
  };
}

// Generador de mock de request
const createMockReq = (params = {}) => ({ params });

// ========== PRUEBAS ==========

async function testGetClientes() {
  global.pool = {
    query: async () => ({
      rows: [{ id_cliente: 1, descripcion_tipocliente: "Persona Natural" }],
    }),
  };
  const res = createMockRes();
  await getClientes({}, res);
  console.log("✅ getClientes →", res.data);
}

async function testGetClienteById_found() {
  global.pool = {
    query: async (sql, params) => ({
      rows: [{
        id_cliente: params[0],
        descripcion_tipocliente: "Persona Natural",
        nombre_cliente: "Juan",
        apellido_cliente: "Pérez",
      }],
    }),
  };
  const res = createMockRes();
  await getClienteById(createMockReq({ id: "123" }), res);
  console.log("✅ getClienteById (found) →", res.data);
}

async function testGetClienteById_notFound() {
  global.pool = {
    query: async () => ({ rows: [] }), // No encuentra cliente
  };
  const res = createMockRes();
  await getClienteById(createMockReq({ id: "999" }), res);
  console.log("✅ getClienteById (not found) →", res.statusCode, res.data);
}

// Ejecutar todas las pruebas
async function runTests() {
  console.log("========= EJECUTANDO PRUEBAS =========");
  await testGetClientes();

  console.log("========= FIN DE PRUEBAS =========");
}

runTests();
