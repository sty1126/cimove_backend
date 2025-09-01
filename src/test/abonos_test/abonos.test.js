import { pool } from "../../db.js";

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

// Mocks para los datos de prueba
const abonosMock = {
  rows: [
    {
      id_abonofactura: 1,
      id_facturaproveedor_abonofactura: 101,
      fecha_abonofactura: '2023-01-15',
      monto_abonofactura: 500,
      estado_abonofactura: 'A'
    },
    {
      id_abonofactura: 2,
      id_facturaproveedor_abonofactura: 102,
      fecha_abonofactura: '2023-01-20',
      monto_abonofactura: 300,
      estado_abonofactura: 'A'
    }
  ]
};

//Importar el controlador después de mockear el pool
import * as abonosController from "../../controllers/abonos.controllers.js";

// Prueba 1: getAbonos
async function testGetAbonos() {
  console.log("🔍 Test: getAbonos");
  pool.query = async () => abonosMock;

  const req = {};
  const res = mockResponse();

  await abonosController.getAbonos(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 2, "❌ No se obtuvieron abonos");
  console.assert(res.data[0].estado_abonofactura === 'A', "❌ Estado incorrecto");
  console.log("✅ getAbonos pasó la prueba\n");
}

// Prueba 2: createAbono
async function testCreateAbono() {
  console.log("🔍 Test: createAbono");
  
  const nuevoAbono = {
    id_abonofactura: 3,
    id_facturaproveedor_abonofactura: 103,
    fecha_abonofactura: '2023-02-01',
    monto_abonofactura: 700,
    estado_abonofactura: 'A'
  };

  pool.query = async () => ({ rows: [nuevoAbono], rowCount: 1 });

  const req = {
    body: {
      id_facturaproveedor_abonofactura: 103,
      fecha_abonofactura: '2023-02-01',
      monto_abonofactura: 700
    }
  };

  const res = mockResponse();

  await abonosController.createAbono(req, res);

  console.assert(res.statusCode === 201, "❌ Código incorrecto");
  console.assert(res.data.id_abonofactura === 3, "❌ ID incorrecto");
  console.assert(res.data.monto_abonofactura === 700, "❌ Monto incorrecto");
  console.assert(res.data.estado_abonofactura === 'A', "❌ Estado incorrecto");
  console.log("✅ createAbono pasó la prueba\n");
}

// Prueba 3: getAbonosPorFactura
async function testGetAbonosPorFactura() {
  console.log("🔍 Test: getAbonosPorFactura");
  
  const abonosFactura = {
    rows: abonosMock.rows.filter(a => a.id_facturaproveedor_abonofactura === 101)
  };

  pool.query = async () => abonosFactura;

  const req = { params: { idFactura: '101' } };
  const res = mockResponse();

  await abonosController.getAbonosPorFactura(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.length === 1, "❌ Cantidad de abonos incorrecta");
  console.assert(res.data[0].id_facturaproveedor_abonofactura === 101, "❌ Factura incorrecta");
  console.log("✅ getAbonosPorFactura pasó la prueba\n");
}

// Prueba 4: anularAbono
async function testAnularAbono() {
  console.log("🔍 Test: anularAbono");
  
  const abonoAnulado = {
    ...abonosMock.rows[0],
    estado_abonofactura: 'I'
  };

  pool.query = async () => ({ rows: [abonoAnulado], rowCount: 1 });

  const req = { params: { id: '1' } };
  const res = mockResponse();

  await abonosController.anularAbono(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.abono.estado_abonofactura === 'I', "❌ Estado no cambiado");
  console.assert(res.data.mensaje === "Abono anulado correctamente", "❌ Mensaje incorrecto");
  console.log("✅ anularAbono pasó la prueba\n");
}

// Prueba 5: getTotalAbonadoPorFactura
async function testGetTotalAbonadoPorFactura() {
  console.log("🔍 Test: getTotalAbonadoPorFactura");
  
  const totalMock = {
    rows: [{ total_abonado: 500 }]
  };

  pool.query = async () => totalMock;

  const req = { params: { idFactura: '101' } };
  const res = mockResponse();

  await abonosController.getTotalAbonadoPorFactura(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.idFactura === '101', "❌ ID Factura incorrecto");
  console.assert(res.data.totalAbonado === 500, "❌ Total abonado incorrecto");
  console.log("✅ getTotalAbonadoPorFactura pasó la prueba\n");
}

// Prueba 6: createAbono - Validación de campos
async function testCreateAbonoValidacion() {
  console.log("🔍 Test: createAbono - Validación de campos");
  
  const req = { body: {} }; // Sin campos requeridos
  const res = mockResponse();

  await abonosController.createAbono(req, res);

  console.assert(res.statusCode === 400, "❌ Código de estado incorrecto para validación");
  console.assert(res.data.error === "Todos los campos son obligatorios", "❌ Mensaje de error incorrecto");
  console.log("✅ createAbono - Validación pasó la prueba\n");
}

// Prueba 7: anularAbono - Abono no encontrado
async function testAnularAbonoNoEncontrado() {
  console.log("🔍 Test: anularAbono - Abono no encontrado");
  
  pool.query = async () => ({ rowCount: 0 });

  const req = { params: { id: '999' } }; // ID inexistente
  const res = mockResponse();

  await abonosController.anularAbono(req, res);

  console.assert(res.statusCode === 404, "❌ Código de estado incorrecto para no encontrado");
  console.assert(res.data.error === "Abono no encontrado", "❌ Mensaje de error incorrecto");
  console.log("✅ anularAbono - No encontrado pasó la prueba\n");
}

// Ejecutar todas las pruebas
(async function runTests() {
  await testGetAbonos();
  await testCreateAbono();
  await testGetAbonosPorFactura();
  await testAnularAbono();
  await testGetTotalAbonadoPorFactura();
  await testCreateAbonoValidacion();
  await testAnularAbonoNoEncontrado();
})();