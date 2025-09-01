import { pool } from "../../db.js";
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
} from "../../modules/inventario/inventario.controllers.js";

// Mock de res
function createMockResponse() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    console.log("→ Respuesta:", this.statusCode, JSON.stringify(this.body, null, 2));
  };
  return res;
}

// Mock de pool.query
pool.query = async (query, params) => {
  // GET ALL
  if (query === "SELECT * FROM inventario") {
    return {
      rows: [
        { id_inventario: "1", existencia_inventario: 50 },
        { id_inventario: "2", existencia_inventario: 20 },
      ],
    };
  }

  // GET BY ID
  if (query.includes("FROM inventario WHERE id_inventario = $1")) {
    if (params[0] === "existe") {
      return {
        rows: [
          {
            id_inventario: "existe",
            id_producto_inventario: "P001",
            existencia_inventario: 10,
            estado_inventario: "A",
          },
        ],
      };
    } else {
      return { rows: [] };
    }
  }

  // CREATE
  if (query.startsWith("INSERT INTO inventario")) {
    return {
      rows: [
        {
          id_inventario: "nuevo",
          ...params.reduce((acc, val, idx) => {
            if (idx === 0) acc.id_producto_inventario = val;
            if (idx === 1) acc.existencia_inventario = val;
            if (idx === 2) acc.estado_inventario = val;
            return acc;
          }, {}),
        },
      ],
    };
  }

  // UPDATE
  if (query.startsWith("UPDATE inventario")) {
    return {
      rows: [
        {
          id_inventario: params[3],
          id_producto_inventario: params[0],
          existencia_inventario: params[1],
          estado_inventario: params[2],
        },
      ],
    };
  }

  return { rows: [] };
};

console.log("=== Test: getInventario ===");
await getInventario({}, createMockResponse());

console.log("\n=== Test: getInventarioById (existe) ===");
await getInventarioById({ params: { inventarioId: "existe" } }, createMockResponse());

console.log("\n=== Test: getInventarioById (no existe) ===");
await getInventarioById({ params: { inventarioId: "no-existe" } }, createMockResponse());

console.log("\n=== Test: createInventario ===");
await createInventario(
  {
    body: {
      id_producto_inventario: "P123",
      existencia_inventario: 100,
      estado_inventario: "A",
    },
  },
  createMockResponse()
);

console.log("\n=== Test: updateInventario ===");
await updateInventario(
  {
    params: { inventarioId: "existe" },
    body: { existencia_inventario: 999 },
  },
  createMockResponse()
);

console.log("\n=== Test: updateInventario (no existe) ===");
await updateInventario(
  {
    params: { inventarioId: "no-existe" },
    body: { existencia_inventario: 999 },
  },
  createMockResponse()
);
