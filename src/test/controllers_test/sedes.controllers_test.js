import * as sedeController from "../../controllers/sedes.controllers.js";
import { pool } from "../../db.js";

const originalQuery = pool.query;

pool.query = async (sql, params) => {
  if (sql.startsWith("SELECT") && sql.includes("FROM SEDE")) {
    return {
      rows: [
        {
          id_sede: 1,
          nombre_sede: "Sede Central",
          id_ciudad_sede: 101,
          direccion_sede: "Calle 123",
          numeroempleados_sede: 50,
          telefono_sede: "1234567",
        },
      ],
    };
  }

  if (sql.startsWith("INSERT INTO SEDE")) {
    return {
      rows: [
        {
          id_sede: 2,
          nombre_sede: params[0],
          id_ciudad_sede: params[1],
          direccion_sede: params[2],
          numeroempleados_sede: params[3],
          telefono_sede: params[4],
          estado_sede: "A",
        },
      ],
    };
  }

  if (sql.startsWith("UPDATE SEDE")) {
    if (params[0] === "not-found") {
      return { rowCount: 0 };
    }
    return { rowCount: 1 };
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

await test("getSedes retorna sedes activas", async () => {
  const req = {};
  const res = mockRes();
  await sedeController.getSedes(req, res);
  if (!Array.isArray(res.body) || res.body.length === 0) {
    throw new Error("No retornó sedes");
  }
});

await test("createSede inserta sede correctamente", async () => {
  const req = {
    body: {
      nombre_sede: "Sucursal Norte",
      id_ciudad_sede: 202,
      direccion_sede: "Av Siempre Viva 742",
      numeroempleados_sede: 20,
      telefono_sede: "8901234",
    },
  };
  const res = mockRes();
  await sedeController.createSede(req, res);
  if (res.statusCode !== 201 || !res.body.id_sede) {
    throw new Error("No insertó correctamente");
  }
});

await test("createSede falla si faltan datos", async () => {
  const req = { body: {} };
  const res = mockRes();
  await sedeController.createSede(req, res);
  if (res.statusCode !== 400) {
    throw new Error("No validó campos obligatorios");
  }
});

await test("desactiva sede correctamente", async () => {
  const req = { params: { id_sede: "1" } };
  const res = mockRes();
  await sedeController.deactivateSede(req, res);
  if (res.body.message !== "Sede desactivada correctamente") {
    throw new Error("No se desactivó correctamente");
  }
});

await test("retorna 404 si sede no existe", async () => {
  const req = { params: { id_sede: "not-found" } };
  const res = mockRes();
  await sedeController.deactivateSede(req, res);
  if (res.statusCode !== 404) {
    throw new Error("No retornó 404 para sede inexistente");
  }
});

pool.query = originalQuery;
