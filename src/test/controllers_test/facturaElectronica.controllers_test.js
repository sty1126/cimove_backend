import { pool } from "../../db.js";
import * as facturacionElectronicaController from "../../controllers/facturaElectronica.controllers.js";

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
const facturasElectronicasMock = {
  rows: [
    {
      id_factura: '1',
      cufe_facturaelectronica: 'ABC123XYZ',
      fecha_facturaelectronica: '2024-05-10T00:00:00.000Z',
      xml_facturaelectronica: '<xml>...</xml>',
      observaciones_facturaelectronica: 'Prueba 1',
      estado_facturaelectronica: 'A'
    },
    {
      id_factura: '2',
      cufe_facturaelectronica: 'DEF456UVW',
      fecha_facturaelectronica: '2024-05-11T00:00:00.000Z',
      xml_facturaelectronica: '<xml>...</xml>',
      observaciones_facturaelectronica: 'Prueba 2',
      estado_facturaelectronica: 'I'
    }
  ]
};

// Prueba: getFacturasElectronicas
async function testGetFacturasElectronicas() {
  console.log("🔍 Test: getFacturasElectronicas");

  pool.query = async () => ({
    rows: facturasElectronicasMock.rows.filter(fe => fe.estado_facturaelectronica === 'A')
  });

  const req = {};
  const res = mockResponse();

  await facturacionElectronicaController.getFacturasElectronicas(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 1, "❌ Cantidad de facturas incorrecta");
  console.assert(res.data[0].id_factura === '1', "❌ ID de factura incorrecto");
  console.log("✅ getFacturasElectronicas pasó la prueba\n");
}

// Prueba: getFacturaElectronicaById
async function testGetFacturaElectronicaById() {
  console.log("🔍 Test: getFacturaElectronicaById");

  pool.query = async (sql, params) => {
    if (params[0] === '1') {
      return { rows: [facturasElectronicasMock.rows[0]] };
    } else {
      return { rows: [] };
    }
  };

  const req = { params: { id: '1' } };
  const res = mockResponse();

  await facturacionElectronicaController.getFacturaElectronicaById(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.id_factura === '1', "❌ ID de factura incorrecto");
  console.log("✅ getFacturaElectronicaById (existente) pasó la prueba\n");

  const reqNotFound = { params: { id: '999' } };
  const resNotFound = mockResponse();

  await facturacionElectronicaController.getFacturaElectronicaById(reqNotFound, resNotFound);

  console.assert(resNotFound.statusCode === 404, "❌ Código incorrecto para no encontrado");
  console.assert(resNotFound.data.message === "Factura electrónica no encontrada", "❌ Mensaje de error incorrecto");
  console.log("✅ getFacturaElectronicaById (no existente) pasó la prueba\n");
}

// Prueba: createFacturaElectronica
async function testCreateFacturaElectronica() {
  console.log("🔍 Test: createFacturaElectronica");

  const nuevaFacturaElectronica = {
    id_factura: '3',
    cufe_facturaelectronica: 'GHI789JKL',
    fecha_facturaelectronica: '2024-05-12T00:00:00.000Z',
    xml_facturaelectronica: '<xml>...</xml>',
    observaciones_facturaelectronica: 'Prueba 3',
    estado_facturaelectronica: 'A'
  };

  pool.query = async () => ({ rows: [nuevaFacturaElectronica] });

  const req = {
    body: {
      idFactura: '3',
      cufe: 'GHI789JKL',
      fecha: '2024-05-12T00:00:00.000Z',
      xml: '<xml>...</xml>',
      observaciones: 'Prueba 3'
    }
  };
  const res = mockResponse();

  await facturacionElectronicaController.createFacturaElectronica(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.id_factura === '3', "❌ ID de factura incorrecto");
  console.log("✅ createFacturaElectronica pasó la prueba\n");
}

// Prueba: deleteFacturaElectronica
async function testDeleteFacturaElectronica() {
  console.log("🔍 Test: deleteFacturaElectronica");

  pool.query = async (sql, params) => {
    if (params[0] === '1') {
      return { rows: [facturasElectronicasMock.rows[0]] };
    } else {
      return { rows: [] };
    }
  };

  const req = { params: { id: '1' } };
  const res = mockResponse();

  await facturacionElectronicaController.deleteFacturaElectronica(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.message === "Factura electrónica eliminada correctamente", "❌ Mensaje incorrecto");
  console.log("✅ deleteFacturaElectronica (existente) pasó la prueba\n");

  const reqNotFound = { params: { id: '999' } };
  const resNotFound = mockResponse();

  await facturacionElectronicaController.deleteFacturaElectronica(reqNotFound, resNotFound);

  console.assert(resNotFound.statusCode === 404, "❌ Código incorrecto para no encontrado");
  console.assert(resNotFound.data.message === "Factura electrónica no encontrada", "❌ Mensaje de error incorrecto");
  console.log("✅ deleteFacturaElectronica (no existente) pasó la prueba\n");
}

// Prueba: updateFacturaElectronica
async function testUpdateFacturaElectronica() {
  console.log("🔍 Test: updateFacturaElectronica");

  const facturaActualizada = {
    id_factura: '1',
    cufe_facturaelectronica: 'XYZ789ABC',
    fecha_facturaelectronica: '2024-05-15T00:00:00.000Z',
    xml_facturaelectronica: '<xml>...</xml>',
    observaciones_facturaelectronica: 'Actualizado',
    estado_facturaelectronica: 'A'
  };

  pool.query = async (sql, params) => {
    if (params[4] === '1') {
      return { rows: [facturaActualizada] };
    } else {
      return { rows: [] };
    }
  };

  const req = {
    params: { id: '1' },
    body: {
      cufe: 'XYZ789ABC',
      fecha: '2024-05-15T00:00:00.000Z',
      xml: '<xml>...</xml>',
      observaciones: 'Actualizado'
    }
  };
  const res = mockResponse();

  await facturacionElectronicaController.updateFacturaElectronica(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.factura.cufe_facturaelectronica === 'XYZ789ABC', "❌ CUFE incorrecto");
  console.log("✅ updateFacturaElectronica (existente) pasó la prueba\n");

  const reqNotFound = {
    params: { id: '999' },
    body: {
      cufe: 'XYZ789ABC',
      fecha: '2024-05-15T00:00:00.000Z',
      xml: '<xml>...</xml>',
      observaciones: 'Actualizado'
    }
  };
  const resNotFound = mockResponse();

  await facturacionElectronicaController.updateFacturaElectronica(reqNotFound, resNotFound);

  console.assert(resNotFound.statusCode === 404, "❌ Código incorrecto para no encontrado");
  console.assert(resNotFound.data.message === "Factura electrónica no encontrada o inactiva", "❌ Mensaje de error incorrecto");
  console.log("✅ updateFacturaElectronica (no existente) pasó la prueba\n");
}

//Ejecutar las pruebas
(async function runTests() {
  await testGetFacturasElectronicas();
  await testGetFacturaElectronicaById();
  await testCreateFacturaElectronica();
  await testDeleteFacturaElectronica();
  await testUpdateFacturaElectronica();
})();