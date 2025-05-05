import { pool } from "../../db.js"; 
import * as documentoController from "../../controllers/tiposDocumento.controllers.js"; 

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

// Mocks para los datos de prueba (tipos de documento)
const tiposDocumentoMock = {
  rows: [
    { id_tipodocumento: 1, nombre_tipodocumento: 'Cédula' },
    { id_tipodocumento: 2, nombre_tipodocumento: 'Pasaporte' },
    { id_tipodocumento: 3, nombre_tipodocumento: 'RUC' }
  ]
};

// Prueba: getTiposDocumento
async function testGetTiposDocumento() {
  console.log("🔍 Test: getTiposDocumento");

  // Mock de pool.query
  pool.query = async () => ({ ...tiposDocumentoMock }); // Simula la respuesta de la base de datos

  const req = {};
  const res = mockResponse();

  await documentoController.getTiposDocumento(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 3, "❌ Cantidad de tipos de documento incorrecta");
  console.assert(res.data[0].nombre_tipodocumento === 'Cédula', "❌ El primer tipo de documento no es 'Cédula'");
  console.assert(res.data[1].nombre_tipodocumento === 'Pasaporte', "❌ El segundo tipo de documento no es 'Pasaporte'");
  console.assert(res.data[2].nombre_tipodocumento === 'RUC', "❌ El tercer tipo de documento no es 'RUC'");
  console.log("✅ getTiposDocumento pasó la prueba\n");
}

// Ejecutar la prueba
(async function runTests() {
  await testGetTiposDocumento();
})();