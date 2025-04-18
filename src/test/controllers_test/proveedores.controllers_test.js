// 👇 IMPORTA Y MOCKEA EL pool ANTES DEL CONTROLADOR
import { pool } from "../../db.js"; // Ajusta según tu estructura

// Mocks para pruebas
const proveedoresMock = {
  rows: [
    { id_proveedor: "123", nombre_proveedor: "Proveedor 1", nombre_tipoproveedor: "Tipo A" },
    { id_proveedor: "456", nombre_proveedor: "Proveedor 2", nombre_tipoproveedor: "Tipo B" }
  ]
};

const tipoProveedorMock = {
  rows: [
    { id_tipoproveedor: 1, nombre_tipoproveedor: "Proveedor de Mercancía" }
  ]
};

// Utilidad para simular respuesta
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

// ⚠️ IMPORTA el controlador DESPUÉS de mockear el pool
import * as proveedorController from "../../controllers/proveedores.controllers.js";

// 🧪 Prueba 1: getProveedores
async function testGetProveedores() {
  console.log("🔍 Test: getProveedores");
  pool.query = async () => proveedoresMock;

  const req = {};
  const res = mockResponse();

  await proveedorController.getProveedores(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(Array.isArray(res.data), "❌ No devolvió un array");
  console.assert(res.data.length === 2, "❌ No se obtuvieron proveedores");
  console.log("✅ getProveedores pasó la prueba\n");
}

// 🧪 Prueba 2: getProveedorById
async function testGetProveedorById() {
  console.log("🔍 Test: getProveedorById");
  pool.query = async () => ({ rows: [proveedoresMock.rows[0]] });

  const req = { params: { id: "123" } };
  const res = mockResponse();

  await proveedorController.getProveedorById(req, res);

  console.assert(res.statusCode === 200, "❌ Código incorrecto");
  console.assert(res.data.id_proveedor === "123", "❌ Proveedor no encontrado");
  console.log("✅ getProveedorById pasó la prueba\n");
}

// 🧪 Prueba 3: createTipoProveedor
async function testCreateTipoProveedor() {
  console.log("🔍 Test: createTipoProveedor");
  
  // Mock que simula exactamente lo que devuelve PostgreSQL
  const mockInsertResult = {
    rows: [{
      id_tipoproveedor: 1,
      nombre_tipoproveedor: "Servicios",
      estado_tipoproveedor: "A"
    }],
    rowCount: 1
  };

  pool.query = async () => mockInsertResult;

  const req = {
    body: {
      nombre_tipoproveedor: "Servicios"
    }
  };

  const res = mockResponse();

  await proveedorController.createTipoProveedor(req, res);

  // Verificaciones actualizadas para los nombres reales de columnas
  console.assert(res.statusCode === 201, "❌ Código incorrecto", res.statusCode);
  console.assert(res.data.id_tipoproveedor === 1, "❌ ID incorrecto", res.data);
  console.assert(res.data.nombre_tipoproveedor === "Servicios", "❌ Nombre incorrecto", res.data);
  console.assert(res.data.estado_tipoproveedor === "A", "❌ Estado incorrecto", res.data);
  console.log("✅ createTipoProveedor pasó la prueba\n");
}

// Ejecuta todas las pruebas
(async function runTests() {
  await testGetProveedores();
  await testGetProveedorById();
  await testCreateTipoProveedor();
})();
