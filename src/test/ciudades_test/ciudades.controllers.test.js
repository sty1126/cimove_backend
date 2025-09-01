import { pool } from '../../db.js';
import { getCiudades, createCiudad } from '../../modules/ciudades/ciudades.controllers.js';

// Mock del método query
pool.query = async (query, params) => {
  
  if (query.startsWith("SELECT")) {
    return {
      rows: [
        { id_ciudad: "11.001", nombre_ciudad: "Bogotá" },
        { id_ciudad: "25.377", nombre_ciudad: "La Calera" },
      ],
    };
  }

  if (query.startsWith("INSERT")) {
    return {
      rows: [{ id_ciudad: "3", nombre_ciudad: params[0], estado_ciudad: "A" }],
    };
  }

  return { rows: [] };
};

// Simulador simple de req y res
function createMockResponse() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = (code) => {
    res.statusCode = code;
    return res;
  };
  res.json = (data) => {
    res.body = data;
    console.log("Respuesta:", res.statusCode, JSON.stringify(res.body, null, 2));
  };
  return res;
}

// Test getCiudades
console.log("=== Test: getCiudades ===");
await getCiudades({}, createMockResponse());

// Test createCiudad con nombre válido
console.log("\n=== Test: createCiudad (válido) ===");
await createCiudad({ body: { nombre_ciudad: "Bogotá" } }, createMockResponse());

// Test createCiudad sin nombre (debe dar resultado tipo error 400)
console.log("\n=== Test: createCiudad (sin nombre) ===");
await createCiudad({ body: {} }, createMockResponse());
