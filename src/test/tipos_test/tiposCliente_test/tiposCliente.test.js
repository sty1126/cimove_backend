import { pool } from "../../../db.js"; 
import * as clienteController from "../../../modules/tipos/tiposCliente/tiposCliente.controllers.js"; 

// Mock de respuesta
function mockResponse() {
  const res = {};
  res.statusCode = 200;
  res.data = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.data = data;
    return this;
  };
  return res;
}

// Mocks para los datos de prueba (tipos de cliente)
const tiposClienteMock = {
  rows: [
    { id_tipocliente: 1, nombre_tipocliente: 'Natural' },
    { id_tipocliente: 2, nombre_tipocliente: 'Jurídico' },
    { id_tipocliente: 3, nombre_tipocliente: 'Mayorista' }
  ]
};

// Prueba: getTiposCliente
async function testGetTiposCliente() {
  console.log("🔍 Test: getTiposCliente");

  // Mock de pool.query
  pool.query = async () => ({ ...tiposClienteMock }); // Simula la respuesta de la base de datos

  const req = {};
  const res = mockResponse();

  await clienteController.getTiposCliente(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 3, "❌ Cantidad de tipos de cliente incorrecta");
  console.assert(res.data[0].nombre_tipocliente === 'Natural', "❌ El primer tipo de cliente no es 'Natural'");
  console.assert(res.data[1].nombre_tipocliente === 'Jurídico', "❌ El segundo tipo de cliente no es 'Jurídico'");
  console.assert(res.data[2].nombre_tipocliente === 'Mayorista', "❌ El tercer tipo de cliente no es 'Mayorista'");
  console.log("✅ getTiposCliente pasó la prueba\n");
}

// Ejecutar la prueba
(async function runTests() {
  await testGetTiposCliente();
})();