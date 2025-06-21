import { pool } from "../../db.js";
import * as metodosPagoController from "../../controllers/metodosPago.controllers.js";

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
const metodosPagoMock = {
  rows: [
    {
      id_metodopago: 1,
      id_tipometodopago_metodopago: 101,
      id_factura_metodopago: 201,
      monto_metodopago: 100,
      estado_metodopago: 'A',
      nombre_tipometodopago: 'Efectivo'
    },
    {
      id_metodopago: 2,
      id_tipometodopago_metodopago: 102,
      id_factura_metodopago: 202,
      monto_metodopago: 200,
      estado_metodopago: 'A',
      nombre_tipometodopago: 'Tarjeta'
    },
    {
      id_metodopago: 3,
      id_tipometodopago_metodopago: 101,
      id_factura_metodopago: 203,
      monto_metodopago: 300,
      estado_metodopago: 'I',
      nombre_tipometodopago: 'Efectivo'
    }
  ]
};

// Prueba: agregarMetodosPago
async function testAgregarMetodosPago() {
  console.log("🔍 Test: agregarMetodosPago");

  pool.query = async () => ({ rows: [] }); // Simula inserciones exitosas

  const req = {
    params: { idFactura: '201' },
    body: {
      metodosPago: [
        { idTipoMetodoPago: 103, monto: 50 },
        { idTipoMetodoPago: 104, monto: 50 }
      ]
    }
  };
  const res = mockResponse();

  await metodosPagoController.agregarMetodosPago(req, res);

  console.assert(res.statusCode === 201, "❌ Código incorrecto");
  console.assert(res.data.mensaje === "Métodos de pago agregados con éxito", "❌ Mensaje incorrecto");
  console.log("✅ agregarMetodosPago pasó la prueba\n");
}

// Prueba: obtenerMetodosPagoPorFactura
async function testObtenerMetodosPagoPorFactura() {
  console.log("🔍 Test: obtenerMetodosPagoPorFactura");

  pool.query = async (sql, params) => {
    if (sql.includes("WHERE mp.ID_FACTURA_METODOPAGO = $1")) {
      return {
        rows: metodosPagoMock.rows.filter(mp => mp.id_factura_metodopago === parseInt(params[0]) && mp.estado_metodopago === 'A')
      };
    }
  };

  const req = { params: { idFactura: '201' } };
  const res = mockResponse();

  await metodosPagoController.obtenerMetodosPagoPorFactura(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 1, "❌ Cantidad de métodos de pago incorrecta");
  console.assert(res.data[0].id_factura_metodopago === 201, "❌ ID de factura incorrecto");
  console.log("✅ obtenerMetodosPagoPorFactura pasó la prueba\n");
}

// Prueba: obtenerTodosLosMetodosPago
async function testObtenerTodosLosMetodosPago() {
  console.log("🔍 Test: obtenerTodosLosMetodosPago");

  pool.query = async (sql) => {
    if (sql.includes("WHERE mp.ESTADO_METODOPAGO = 'A'")) {
      return {
        rows: metodosPagoMock.rows.filter(mp => mp.estado_metodopago === 'A')
      };
    }
  };

  const req = {};
  const res = mockResponse();

  await metodosPagoController.obtenerTodosLosMetodosPago(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 2, "❌ Cantidad de métodos de pago incorrecta");
  console.log("✅ obtenerTodosLosMetodosPago pasó la prueba\n");
}

// Prueba: anularMetodoPago
async function testAnularMetodoPago() {
  console.log("🔍 Test: anularMetodoPago");

  pool.query = async () => ({ rows: [] }); // Simula una actualización exitosa

  const req = { params: { idMetodoPago: '1' } };
  const res = mockResponse();

  await metodosPagoController.anularMetodoPago(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.mensaje === "Método de pago anulado con éxito", "❌ Mensaje incorrecto");
  console.log("✅ anularMetodoPago pasó la prueba\n");
}

//Ejecutar las pruebas
(async function runTests() {
  await testAgregarMetodosPago();
  await testObtenerMetodosPagoPorFactura();
  await testObtenerTodosLosMetodosPago();
  await testAnularMetodoPago();
})();