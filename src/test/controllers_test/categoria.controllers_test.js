import { pool } from '../../db.js';
import { getCategorias, createCategoria } from "../../controllers/categoria.controllers.js";

// Mock del pool
const mockQuery = async (sql, params) => {
  if (sql.includes("SELECT")) {
    return {
      rows: [
        { id_categoria: 1, descripcion_categoria: "Categoría Prueba A" },
        { id_categoria: 2, descripcion_categoria: "Categoría Prueba B" },
      ],
    };
  } else if (sql.includes("INSERT")) {
    return {
      rows: [{ id_categoria: 3, descripcion_categoria: params[0], estado_categoria: 'A' }],
    };
  }
  throw new Error("Consulta no soportada");
};

// Se sobreescribe temporalmente pool.query para la prueba
pool.query = async () => ({
    rows: [{ id: 1, nombre: 'Categoría Prueba A' }],
  });

  
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

// Test de getCategorias
const testGetCategorias = async () => {
  const req = {};
  const res = createMockRes();

  await getCategorias(req, res);

  console.log("Test getCategorias:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

// Test de createCategoria
const testCreateCategoria = async () => {
  const req = {
    body: {
      descripcion_categoria: "Categoría Prueba Test",
    },
  };
  const res = createMockRes();

  await createCategoria(req, res);

  console.log("\nTest createCategoria:");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

// Test de createCategoria con error de validación
const testCreateCategoriaMissingField = async () => {
  const req = {
    body: {},
  };
  const res = createMockRes();

  await createCategoria(req, res);

  console.log("\nTest createCategoria (faltan datos):");
  console.log("Status:", res.statusCode);
  console.log("Response:", res.body);
};

// Ejecutar pruebas
await testGetCategorias();
await testCreateCategoria();
await testCreateCategoriaMissingField();
