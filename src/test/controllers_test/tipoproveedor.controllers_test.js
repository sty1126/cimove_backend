import * as tipoProveedorController from "../../controllers/tipoproveedor.controllers.js";
import { pool } from "../../db.js";

const originalQuery = pool.query;

pool.query = async (sql, params) => {
  if (sql.includes("FROM TIPOPROVEEDOR")) {
    return {
      rows: [
        {
          id_tipoproveedor: 1,
          nombre_tipoproveedor: "Distribuidor",
        },
      ],
    };
  }

  if (sql.startsWith("INSERT INTO TIPOPROVEEDOR")) {
    return {
      rows: [
        {
          id_tipoproveedor: 2,
          nombre_tipoproveedor: params[0],
          estado_tipoproveedor: "A",
        },
      ],
    };
  }

  return { rows: [] };
};

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

const test = async (desc, fn) => {
  try {
    await fn();
    console.log(`✅ ${desc}`);
  } catch (e) {
    console.error(`❌ ${desc}`);
    console.error(e);
  }
};

await test("getTiposProveedor retorna tipos activos", async () => {
  const req = {};
  const res = mockRes();
  await tipoProveedorController.getTiposProveedor(req, res);
  if (!Array.isArray(res.body) || res.body.length === 0) {
    throw new Error("No retornó tipos de proveedor");
  }
});

await test("createTipoProveedor crea tipo correctamente", async () => {
  const req = { body: { nombre_tipoproveedor: "Mayorista" } };
  const res = mockRes();
  await tipoProveedorController.createTipoProveedor(req, res);
  if (res.statusCode !== 201 || !res.body.id_tipoproveedor) {
    throw new Error("No se insertó el tipo");
  }
});

await test("createTipoProveedor falla si no se envía nombre", async () => {
  const req = { body: {} };
  const res = mockRes();
  await tipoProveedorController.createTipoProveedor(req, res);
  if (res.statusCode !== 400) {
    throw new Error("No validó ausencia de nombre");
  }
});

pool.query = originalQuery;