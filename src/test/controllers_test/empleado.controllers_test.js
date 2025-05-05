import * as empleadosController from "../../controllers/empleados.controllers.js"; // Ajusta el path si es necesario
import { pool } from "../../db.js";

// Mock de req y res
const mockRequest = (body = {}, params = {}) => ({ body, params });
const mockResponse = () => {
  const res = {};
  res.status = (code) => {
    console.log(`Status: ${code}`);
    return res;
  };
  res.json = (data) => {
    console.log("Response:", JSON.stringify(data, null, 2));
    return res;
  };
  return res;
};

// Test: obtener empleados
const testGetEmpleados = async () => {
  console.log("\n🔍 Test: getEmpleadosConUsuario");
  const req = mockRequest();
  const res = mockResponse();
  await empleadosController.getEmpleadosConUsuario(req, res);
};

// Test: crear empleado
const testCrearEmpleado = async () => {
  console.log("\n🆕 Test: crearEmpleado");
  const req = mockRequest({
    id_empleado: "997",
    id_sede_empleado: "1",
    id_tipodocumento_empleado: "1",
    nombre_empleado: "Juan Test",
    telefono_empleado: "3001234567",
    cargo_empleado: "Tester",
    email_empleado: "nuevo@test.com",
    email_usuario: "nuevousuario@test.com",
    telefono_usuario: "3007654321",
    id_tipousuario_usuario: "2",
    monto_salario: 2000000,
    tipopago_salario: "Mensual",
  });
  const res = mockResponse();
  await empleadosController.crearEmpleado(req, res);
};

// Test: eliminar empleado
const testEliminarEmpleado = async () => {
  console.log("\n🗑️ Test: eliminarEmpleado");
  const req = mockRequest({}, { id: "999" });
  const res = mockResponse();
  await empleadosController.eliminarEmpleado(req, res);
};

// Test: obtener empleado por ID
const testGetEmpleadoPorId = async () => {
  console.log("\n🔎 Test: getEmpleadoPorId");
  const req = mockRequest({}, { id: "999" });
  const res = mockResponse();
  await empleadosController.getEmpleadoPorId(req, res);
};

/* Test: actualizar empleado
const testActualizarEmpleado = async () => {
  console.log("\n✏️ Test: actualizarEmpleado");
  const req = mockRequest({
    id_sede_empleado: "2",
    nombre_empleado: "Juan Actualizado",
    telefono_empleado: "3009999999",
    cargo_empleado: "Analista QA",
    email_empleado: "juanupdate@test.com",
    email_usuario: "juanupdateusuario@test.com",
    telefono_usuario: "3110000000",
    id_tipousuario_usuario: "3",
    monto_salario: 2500000,
    tipopago_salario: "Quincenal",
  }, { id: "999" });
  const res = mockResponse();
  await empleadosController.actualizarEmpleado(req, res);
};
*/


// Ejecutar todos los tests
const runAllTests = async () => {
  try {
    await testGetEmpleados();
    await testCrearEmpleado();
    await testGetEmpleadoPorId();
    await testEliminarEmpleado();
  } catch (err) {
    console.error("❌ Error ejecutando test:", err.message);
  } finally {
    await pool.end(); // cerrar pool de conexiones
  }
};

runAllTests();
