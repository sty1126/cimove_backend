import { pool } from "../../db.js";
import * as metodoPagoController from "../../controllers/tiposMetodoPago.controllers.js";

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

// Mocks para los datos de prueba (tipos de método de pago)
const tiposMetodoPagoMock = {
  rows: [
    {
      ID_TIPOMETODOPAGO: 1,
      NOMBRE_TIPOMETODOPAGO: 'Efectivo',
      COMISION_TIPOMETODOPAGO: 0.00,
      RECEPCION_TIPOMETODOPAGO: true,
      ESTADO_TIPOMETODOPAGO: 'A'
    },
    {
      ID_TIPOMETODOPAGO: 2,
      NOMBRE_TIPOMETODOPAGO: 'Tarjeta de Crédito',
      COMISION_TIPOMETODOPAGO: 0.03,
      RECEPCION_TIPOMETODOPAGO: true,
      ESTADO_TIPOMETODOPAGO: 'A'
    },
    {
      ID_TIPOMETODOPAGO: 3,
      NOMBRE_TIPOMETODOPAGO: 'Transferencia',
      COMISION_TIPOMETODOPAGO: 0.00,
      RECEPCION_TIPOMETODOPAGO: true,
      ESTADO_TIPOMETODOPAGO: 'I'
    }
  ]
};

// Prueba: getTiposMetodoPago
async function testGetTiposMetodoPago() {
  console.log("🔍 Test: getTiposMetodoPago");

  // Mock de pool.query
  pool.query = async () => ({
    rows: tiposMetodoPagoMock.rows.filter(tipo => tipo.ESTADO_TIPOMETODOPAGO === 'A')
  });

  const req = {};
  const res = mockResponse();

  await metodoPagoController.getTiposMetodoPago(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 2, "❌ Cantidad de tipos de método de pago incorrecta");
  console.assert(res.data[0].NOMBRE_TIPOMETODOPAGO === 'Efectivo', "❌ El primer tipo de método de pago no es 'Efectivo'");
  console.assert(res.data[1].NOMBRE_TIPOMETODOPAGO === 'Tarjeta de Crédito', "❌ El segundo tipo de método de pago no es 'Tarjeta de Crédito'");
  console.log("✅ getTiposMetodoPago pasó la prueba\n");
}

// Prueba: crearTipoMetodoPago
async function testCrearTipoMetodoPago() {
  console.log("🔍 Test: crearTipoMetodoPago");

  const nuevoTipo = {
    ID_TIPOMETODOPAGO: 4,
    NOMBRE_TIPOMETODOPAGO: 'Cheque',
    COMISION_TIPOMETODOPAGO: 0.01,
    RECEPCION_TIPOMETODOPAGO: false,
    ESTADO_TIPOMETODOPAGO: 'A'
  };

  // Mock de pool.query
  pool.query = async () => ({ rows: [nuevoTipo], rowCount: 1 });

  const req = {
    body: {
      nombre: 'Cheque',
      comision: 0.01,
      recepcion: false
    }
  };

  const res = mockResponse();

  await metodoPagoController.crearTipoMetodoPago(req, res);

  console.assert(res.statusCode === 201, "❌ Código de estado incorrecto");
  console.assert(res.data.mensaje === "Tipo de método de pago creado con éxito", "❌ Mensaje incorrecto");
  console.log("✅ crearTipoMetodoPago pasó la prueba\n");
}

// Prueba: actualizarTipoMetodoPago
async function testActualizarTipoMetodoPago() {
  console.log("🔍 Test: actualizarTipoMetodoPago");

  // Mock de pool.query
  pool.query = async () => ({ rowCount: 1 });

  const req = {
    params: { id: 1 },
    body: {
      nombre: 'Efectivo Actualizado',
      comision: 0.01,
      recepcion: false
    }
  };

  const res = mockResponse();

  await metodoPagoController.actualizarTipoMetodoPago(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(res.data.mensaje === "Tipo de método de pago actualizado con éxito", "❌ Mensaje incorrecto");
  console.log("✅ actualizarTipoMetodoPago pasó la prueba\n");
}

// Prueba: eliminarTipoMetodoPago
async function testEliminarTipoMetodoPago() {
  console.log("🔍 Test: eliminarTipoMetodoPago");

  // Mock de pool.query
  pool.query = async () => ({ rowCount: 1 });

  const req = {
    params: { id: 1 }
  };

  const res = mockResponse();

  await metodoPagoController.eliminarTipoMetodoPago(req, res);

  console.assert(res.statusCode === 200, "❌ Código de estado incorrecto");
  console.assert(res.data.mensaje === "Tipo de método de pago eliminado correctamente", "❌ Mensaje incorrecto");
  console.log("✅ eliminarTipoMetodoPago pasó la prueba\n");
}

// Ejecutar todas las pruebas
(async function runTests() {
  await testGetTiposMetodoPago();
  await testCrearTipoMetodoPago();
  await testActualizarTipoMetodoPago();
  await testEliminarTipoMetodoPago();
})();