import { pool } from "../../../db.js"; 
import * as usuarioController from "../../../modules/usuario/usuario.controllers.js"; 

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

// Mocks para los datos de prueba (tipos de usuario)
const tiposUsuarioMock = {
  rows: [
    { ID_TIPOUSUARIO: 1, NOMBRE_TIPOUSUARIO: 'Administrador', ESTADO_TIPOUSUARIO: 'A' },
    { ID_TIPOUSUARIO: 2, NOMBRE_TIPOUSUARIO: 'Empleado', ESTADO_TIPOUSUARIO: 'A' },
    { ID_TIPOUSUARIO: 3, NOMBRE_TIPOUSUARIO: 'Cliente', ESTADO_TIPOUSUARIO: 'I' }
  ]
};

// Prueba: getTiposUsuario
async function testGetTiposUsuario() {
  console.log("🔍 Test: getTiposUsuario");

  // Mock de pool.query
  pool.query = async () => ({
    rows: tiposUsuarioMock.rows.filter(tipo => tipo.ESTADO_TIPOUSUARIO === 'A')
  });

  const req = {};
  const res = mockResponse();

  await usuarioController.getTiposUsuario(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 2, "❌ Cantidad de tipos de usuario incorrecta");
  console.assert(res.data[0].NOMBRE_TIPOUSUARIO === 'Administrador', "❌ El primer tipo de usuario no es 'Administrador'");
  console.assert(res.data[1].NOMBRE_TIPOUSUARIO === 'Empleado', "❌ El segundo tipo de usuario no es 'Empleado'");
  console.log("✅ getTiposUsuario pasó la prueba\n");
}

// Ejecutar la prueba
(async function runTests() {
  await testGetTiposUsuario();
})();