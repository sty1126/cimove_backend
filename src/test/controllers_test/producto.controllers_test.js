import { pool } from '../../db.js';
import {
  getProducto,
  getProductos,
  createProducto,
  putProducto,
  deleteProducto,
  getProductosDetalles,
  getProductoDetalle,
  getProveedoresPorProducto
} from "../../controllers/productos.controllers.js";

// Función para simular el objeto res
const createMockRes = () => {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(payload) {
      this.body = payload;
    },
  };
};

// =======================
// TESTS
// =======================

const testGetProducto = async () => {
  const req = { params: { productoId: 1 } };
  const res = createMockRes();

  pool.query = async (sql, params) => ({
    rows: [{ id_producto: 1, nombre_producto: "Producto Mock" }],
  });

  await getProducto(req, res);

  console.log("\nTest getProducto:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testGetProductos = async () => {
  const req = {};
  const res = createMockRes();

  pool.query = async () => ({
    rows: [
      { id_producto: 1, nombre_producto: "P1" },
      { id_producto: 2, nombre_producto: "P2" },
    ],
  });

  await getProductos(req, res);

  console.log("\nTest getProductos:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testCreateProducto = async () => {
  const req = {
    body: {
      id_producto: 10,
      id_categoria_producto: 1,
      nombre_producto: "Producto Nuevo",
      descripcion_producto: "Desc",
      precioventaact_producto: 5000,
      costoventa_producto: 3000,
      margenutilidad_producto: 40,
      valoriva_producto: 19,
    },
  };
  const res = createMockRes();

  pool.query = async () => ({
    rows: [req.body],
  });

  await createProducto(req, res);

  console.log("\nTest createProducto:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testPutProducto = async () => {
  const req = {
    params: { productoId: 2 },
    body: {
      nombre_producto: "Actualizado",
    },
  };
  const res = createMockRes();

  pool.query = async (sql) => {
    if (sql.includes("SELECT")) {
      return { rows: [{ id_producto: 2, nombre_producto: "Viejo" }] };
    } else if (sql.includes("UPDATE")) {
      return { rows: [{ id_producto: 2, nombre_producto: "Actualizado" }] };
    }
  };

  await putProducto(req, res);

  console.log("\nTest putProducto:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testDeleteProducto = async () => {
  const req = { params: { id: 3 } };
  const res = createMockRes();

  pool.query = async () => ({
    rows: [{ id_producto: 3 }],
  });

  await deleteProducto(req, res);

  console.log("\nTest deleteProducto:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testGetProductosDetalles = async () => {
  const req = {};
  const res = createMockRes();

  pool.query = async () => ({
    rows: [
      { id_producto: 1, categoria: "Cat A", existencia_producto: 10 },
      { id_producto: 2, categoria: "Cat B", existencia_producto: 5 },
    ],
  });

  await getProductosDetalles(req, res);

  console.log("\nTest getProductosDetalles:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testGetProductoDetalle = async () => {
  const req = { params: { productoId: 1 } };
  const res = createMockRes();

  pool.query = async (sql) => {
    if (sql.includes("FROM PRODUCTO")) {
      return {
        rows: [{ id_producto: 1, nombre_producto: "Producto Detalle", categoria: "Cat X" }],
      };
    } else if (sql.includes("FROM INVENTARIOLOCAL")) {
      return {
        rows: [{ sede_id: 1, existencia: 20, sede_nombre: "Sede Central" }],
      };
    }
  };

  await getProductoDetalle(req, res);

  console.log("\nTest getProductoDetalle:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

const testGetProveedoresPorProducto = async () => {
  const req = { params: { productoId: 1 } };
  const res = createMockRes();

  pool.query = async () => ({
    rows: [{ id_proveedor: 1, nombre_proveedor: "Proveedor X", estado_proveedorproducto: "A" }],
  });

  await getProveedoresPorProducto(req, res);

  console.log("\nTest getProveedoresPorProducto:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

// =======================
// Ejecutar todas las pruebas
// =======================
await testGetProducto();
await testGetProductos();
await testCreateProducto();
await testPutProducto();
await testDeleteProducto();
await testGetProductosDetalles();
await testGetProductoDetalle();
await testGetProveedoresPorProducto();
