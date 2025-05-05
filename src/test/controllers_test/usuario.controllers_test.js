import { pool } from "../../db.js"; // Ajusta la ruta si es necesario
import * as usuarioController from "../../controllers/usuario.controllers.js"; // Ajusta la ruta si es necesario
import bcrypt from "bcryptjs"; // Importa bcrypt para usar en la prueba

// Mock de respuesta
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

// Mock de pool.query
const mockQuery = async (sql, params) => {
  // Simula la inserción exitosa
  if (sql.includes("INSERT INTO USUARIO")) {
    return {
      rows: [{
        ID_EMPLEADO_USUARIO: params[0],
        CONTRASENA_USUARIO: params[1], // La contraseña hasheada simulada
        EMAIL_USUARIO: params[2],
        TELEFONO_USUARIO: params[3],
        ID_TIPOUSUARIO_USUARIO: params[4],
        ESTADO_USUARIO: 'A'
      }],
      rowCount: 1
    };
  }
  return { rows: [], rowCount: 0 }; // Default para otras consultas (no se usan en estas pruebas)
};

pool.query = mockQuery;

// Prueba: createUsuario - Éxito
async function testCreateUsuario() {
  console.log("🔍 Test: createUsuario - Éxito");

  const nuevoUsuario = {
    id_empleado_usuario: 101,
    contrasena_usuario: 'password123',
    email_usuario: 'test@example.com',
    telefono_usuario: '123-456-7890',
    id_tipousuario_usuario: 1,
  };

  const req = { body: nuevoUsuario };
  const res = mockResponse();

  // Simula bcrypt.genSalt y bcrypt.hash
  const mockSalt = 'mockSalt';
  const mockHashedPassword = `hashed_${nuevoUsuario.contrasena_usuario}`;
  bcrypt.genSalt = async () => mockSalt;
  bcrypt.hash = async () => mockHashedPassword;


  await usuarioController.createUsuario(req, res);

  console.assert(res.statusCode === 201, "❌ Código de estado incorrecto");
  console.assert(res.data.ID_EMPLEADO_USUARIO === 101, "❌ ID de empleado incorrecto");
  console.assert(res.data.EMAIL_USUARIO === 'test@example.com', "❌ Email incorrecto");
  console.assert(res.data.CONTRASENA_USUARIO === mockHashedPassword, "❌ Contraseña no hasheada");
  console.assert(res.data.ID_TIPOUSUARIO_USUARIO === 1, "❌ ID de tipo de usuario incorrecto");
  console.assert(res.data.ESTADO_USUARIO === 'A', "❌ Estado de usuario incorrecto");
  console.log("✅ createUsuario - Éxito pasó la prueba\n");
}

// Prueba: createUsuario - Campos obligatorios faltantes
async function testCreateUsuarioCamposFaltantes() {
  console.log("🔍 Test: createUsuario - Campos obligatorios faltantes");

  const usuarioIncompleto = {
    contrasena_usuario: 'password123',
    email_usuario: 'test@example.com',
    id_tipousuario_usuario: 1,
  };

  const req = { body: usuarioIncompleto };
  const res = mockResponse();

  await usuarioController.createUsuario(req, res);

  console.assert(res.statusCode === 400, "❌ Código de estado incorrecto");
  console.assert(res.data.error === "Todos los campos obligatorios deben ser proporcionados", "❌ Mensaje de error incorrecto");
  console.log("✅ createUsuario - Campos obligatorios faltantes pasó la prueba\n");
}

// Ejecutar las pruebas
(async function runTests() {
  await testCreateUsuario();
  await testCreateUsuarioCamposFaltantes();
})();