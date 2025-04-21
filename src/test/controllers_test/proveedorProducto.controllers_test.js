import * as proveedorProductoController from "../../controllers/proveedorproducto.controllers.js";
import { pool } from "../../db.js";


const originalQuery = pool.query;

// Mock temporal
pool.query = async (sql, params) => {
  if (
    sql.includes("FROM PROVEEDORPRODUCTO") &&
    sql.includes("JOIN PROVEEDOR")
  ) {
    return {
      rows: [
        {
          id_proveedorproducto: 1,
          id_proveedor: "123",
          nombre_proveedor: "Proveedor Test",
        },
      ],
    };
  }

  if (sql.startsWith("INSERT INTO PROVEEDORPRODUCTO")) {
    return {
      rows: [
        {
          id_proveedorproducto: 2,
          id_proveedor_proveedorproducto: "123",
          id_producto_proveedorproducto: "456",
          estado_proveedorproducto: "A",
        },
      ],
    };
  }

  if (sql.startsWith("UPDATE PROVEEDORPRODUCTO")) {
    if (params[0] === "not-found") {
      return { rowCount: 0 };
    }
    return {
      rowCount: 1,
      rows: [{ id_proveedorproducto: 2 }],
    };
  }

  return { rows: [] };
};

// Mock de respuesta
const mockRes = () => {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    return data;
  };
  return res;
};

// Función test utilitaria
const test = async (desc, fn) => {
  try {
    await fn();
    console.log(`✅ ${desc}`);
  } catch (e) {
    console.error(`❌ ${desc}`);
    console.error(e);
  }
};

// Test
await test("getProveedoresByProducto retorna lista de proveedores", async () => {
  const req = { params: { id_producto: "456" } };
  const res = mockRes();
  await proveedorProductoController.getProveedoresByProducto(req, res);
  if (!Array.isArray(res.body) || res.body.length === 0) {
    throw new Error("No se retornaron proveedores");
  }
});

await test("asociarProveedorAProducto realiza inserción correctamente", async () => {
  const req = {
    body: {
      id_proveedor_proveedorproducto: "123",
      id_producto_proveedorproducto: "456",
    },
  };
  const res = mockRes();
  await proveedorProductoController.asociarProveedorAProducto(req, res);
  if (res.statusCode !== 201 || !res.body.id_proveedorproducto) {
    throw new Error("No se creó la asociación");
  }
});

await test("asociarProveedorAProducto falla si faltan datos", async () => {
  const req = { body: {} };
  const res = mockRes();
  await proveedorProductoController.asociarProveedorAProducto(req, res);
  if (res.statusCode !== 400) {
    throw new Error("No validó correctamente los datos faltantes");
  }
});

await test("desasociarProveedorDeProducto desactiva la relación correctamente", async () => {
  const req = { params: { id_proveedorproducto: "2" } };
  const res = mockRes();
  await proveedorProductoController.desasociarProveedorDeProducto(req, res);
  if (res.body.message !== "Proveedor desasociado correctamente") {
    throw new Error("No se desasoció correctamente");
  }
});

await test("desasociarProveedorDeProducto retorna 404 si no se encuentra la asociación", async () => {
  const req = { params: { id_proveedorproducto: "not-found" } };
  const res = mockRes();
  await proveedorProductoController.desasociarProveedorDeProducto(req, res);
  if (res.statusCode !== 404) {
    throw new Error("No manejó correctamente la ausencia de relación");
  }
});


pool.query = originalQuery;
