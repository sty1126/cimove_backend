import { pool } from "../../db.js";
import * as inventarioLocalController from "../../controllers/inventariolocal.controllers.js";

// Mock de pool
let queryData = [];
const mockPool = {
  query: async (sql, params) => {
    queryData.push({ sql, params });

    // Simula verificación de existencia del producto en sede, con el fin de evitar conflicto
    if (sql.includes("SELECT * FROM inventariolocal WHERE id_producto_inventariolocal =") &&
        sql.includes("AND id_sede_inventariolocal =")) {
      // Retornar vacío para que permita el insert
      return { rows: [] };
    }

    // Mocks para select por id
    if (sql.includes("SELECT * FROM inventariolocal WHERE id_inventariolocal =")) {
      return {
        rows: params[0] === 1 ? [{ id_inventariolocal: 1, existencia_inventariolocal: 10 }] : [],
      };
    }

    if (sql.startsWith("SELECT * FROM inventariolocal")) {
      return { rows: [{ id_inventariolocal: 1 }, { id_inventariolocal: 2 }] };
    }

    if (sql.startsWith("SELECT i.*, COALESCE")) {
      return {
        rows: params[0] === 1 ? [{ id_inventariolocal: 1, existencia_producto: 20 }] : [],
      };
    }

    // INSERT: simula creación exitosa
    if (sql.startsWith("INSERT INTO inventariolocal")) {
      return {
        rows: [
          {
            id_producto_inventariolocal: 1,
            id_sede_inventariolocal: 1,
            existencia_inventariolocal: 30,
            stockminimo_inventariolocal: 10,
            stockmaximo_inventariolocal: 50,
            estado_inventariolocal: "A",
          },
        ],
      };
    }

    if (sql.startsWith("UPDATE inventariolocal")) {
      return {
        rows: [
          {
            id_inventariolocal: 1,
            existencia_inventariolocal: 20,
          },
        ],
      };
    }

    if (sql.startsWith("SELECT existencia_inventariolocal FROM INVENTARIOLOCAL")) {
      return {
        rows: [{ existencia_inventariolocal: 10 }],
      };
    }

    if (sql.startsWith("SELECT ID_INVENTARIOLOCAL FROM INVENTARIOLOCAL")) {
      return {
        rows: [{ id_inventariolocal: 5 }],
      };
    }

    return { rows: [] };
  },
};

pool.query = mockPool.query;

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

const test = async (description, fn) => {
  try {
    await fn();
    console.log(`✅ ${description}`);
  } catch (e) {
    console.error(`❌ ${description}`);
    console.error(e);
  }
};

// Tests
await test("getInventarioLocal debería devolver registros", async () => {
  const res = mockRes();
  await inventarioLocalController.getInventarioLocal({}, res);
  if (!Array.isArray(res.body)) throw new Error("No devolvió un array");
});

await test("getInventarioLocalBySede debería devolver productos para sede 1", async () => {
  const req = { params: { sedeId: 1 } };
  const res = mockRes();
  await inventarioLocalController.getInventarioLocalBySede(req, res);
  if (res.statusCode !== 200 || res.body.length === 0)
    throw new Error("No devolvió productos");
});

await test("createInventarioLocal debería registrar correctamente", async () => {
  const req = {
    body: {
      id_producto_inventariolocal: 1,
      id_sede_inventariolocal: 1,
      existencia_inventariolocal: 30,
      stockminimo_inventariolocal: 10,
      stockmaximo_inventariolocal: 50,
    },
  };
  const res = mockRes();
  await inventarioLocalController.createInventarioLocal(req, res);
  if (res.statusCode !== 201) throw new Error("No se registró el producto");
});


await test("updateInventarioLocal debería actualizar existencia", async () => {
  const req = {
    params: { inventarioLocalId: 1 },
    body: { existencia_inventariolocal: 20 },
  };
  const res = mockRes();
  await inventarioLocalController.updateInventarioLocal(req, res);
  if (res.body.existencia_inventariolocal !== 20)
    throw new Error("No actualizó correctamente");
});

await test("addStockToSede debería aumentar el stock", async () => {
  const req = {
    params: { idProducto: 1, idSede: 1 },
    body: { cantidad: 5 },
  };
  const res = mockRes();
  await inventarioLocalController.addStockToSede(req, res);
  if (res.body.message !== "Stock añadido exitosamente")
    throw new Error("No añadió stock correctamente");
});

await test("existeEnInventarioLocal debería devolver que existe", async () => {
  const req = { params: { idProducto: 1, idSede: 1 } };
  const res = mockRes();
  await inventarioLocalController.existeEnInventarioLocal(req, res);
  if (!res.body.existe) throw new Error("No detectó existencia");
});
