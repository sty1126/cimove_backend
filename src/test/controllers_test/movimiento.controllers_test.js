import * as movimientoController from "../../controllers/movimiento.controller.js";
import { pool } from "../../db.js"; // <-- Asegúrate de importar el pool

let queryCalls = [];

const mockPool = {
  query: async (sql, params) => {
    queryCalls.push({ sql, params });

    if (sql === "SELECT * FROM MOVPRODUCTO") {
      return { rows: [{ id_movimiento: 1 }, { id_movimiento: 2 }] };
    }

    if (sql === "SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'") {
      return { rows: [{ id: 1, tipo: "ENTRADA" }] };
    }

    if (sql.includes("SELECT EXISTENCIA_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL =")) {
      return { rows: [{ existencia_inventariolocal: 10 }] };
    }

    if (sql.startsWith("INSERT INTO MOVPRODUCTO")) {
      return {
        rows: [
          {
            id_movimiento: 99,
            id_producto_movimiento: 1,
            cantidad_movimiento: 5,
          },
        ],
      };
    }

    if (sql.startsWith("UPDATE INVENTARIOLOCAL SET EXISTENCIA_INVENTARIOLOCAL = EXISTENCIA_INVENTARIOLOCAL -")) {
      return { rowCount: 1 };
    }

    if (sql.includes("SELECT 1 FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL")) {
      return { rowCount: 0 };
    }

    if (sql.startsWith("INSERT INTO INVENTARIOLOCAL")) {
      return { rowCount: 1 };
    }

    return { rows: [] };
  },
};

//Reemplazo del método query del pool
pool.query = mockPool.query;


// Mock básico de res
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
  } catch (err) {
    console.error(`❌ ${description}`);
    console.error(err);
  }
};

// Ejecutar tests
await test("getMovimientos debe devolver lista de movimientos", async () => {
  const res = mockRes();
  await movimientoController.getMovimientos({}, res);
  if (!Array.isArray(res.body)) throw new Error("No devolvió array de movimientos");
});

await test("getTipoMovimientos debe devolver tipos activos", async () => {
  const res = mockRes();
  await movimientoController.getTipoMovimientos({}, res);
  if (!res.body.length || res.body[0].tipo !== "ENTRADA")
    throw new Error("No devolvió tipos correctos");
});

await test("createMovimiento debe insertar correctamente entre sedes", async () => {
  const req = {
    body: {
      ID_TIPOMOV_MOVIMIENTO: 1,
      ID_PRODUCTO_MOVIMIENTO: 1,
      CANTIDAD_MOVIMIENTO: 5,
      ID_SEDE_MOVIMIENTO: 1,
      ID_SEDEDESTINO_MOVIMIENTO: 2,
      STOCK_MINIMO: 2,
      STOCK_MAXIMO: 20,
    },
  };
  const res = mockRes();
  await movimientoController.createMovimiento(req, res);
  if (res.statusCode !== 201 || res.body.message !== "Movimiento registrado con éxito") {
    throw new Error("No se registró correctamente el movimiento");
  }
});
