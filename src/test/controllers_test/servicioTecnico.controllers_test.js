import { pool } from "../../db.js";
import * as servicioTecnicoController from "../../controllers/servicioTecnico.controllers.js";

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

// Mock del cliente de la base de datos para transacciones
const mockClient = {
  query: async (sql, params) => {
    if (sql.includes("BEGIN") || sql.includes("COMMIT") || sql.includes("ROLLBACK")) {
      return;
    }
    if (sql.includes("INSERT INTO FACTURA")) {
      return { rows: [{ id_factura: 303 }] };
    }
    if (sql.includes("INSERT INTO SERVICIOTECNICO")) {
      // Corregido: Devolver un objeto que coincida con lo que espera la prueba
      console.log("Parámetros de INSERT INTO SERVICIOTECNICO:", params); // <-- AGREGADO PARA DEBUG
      return {
        rows: [{
          id_serviciotecnico: 3,
          id_sede_serviciotecnico: params[0],
          id_proveedor_serviciotecnico: params[1],
          id_cliente_serviciotecnico: params[2],
          id_factura_serviciotecnico: params[3],
          nombre_serviciotecnico: params[4], 
          descripcion_serviciotecnico: params[5],
          fecha_serviciotecnico: params[6],
          fecha_entrega_serviciotecnico: params[7],
          tipo_dano_serviciotecnico: params[8],
          clave_dispositivo_serviciotecnico: params[9],
          costo_serviciotecnico: params[10],
          abono_serviciotecnico: params[11],
          garantia_aplica_serviciotecnico: params[12],
          fecha_garantia_serviciotecnico: params[13],
          numero_contacto_alternativo_servicio: params[14],
          autorizado_serviciotecnico: params[15]
        }]
      };
    }
    if (sql.includes("INSERT INTO METODOPAGO")) {
      return { rows: [] };
    }
    if (sql.includes("SELECT * FROM SERVICIOTECNICO")) {
      return { rows: [] };
    }
    if (sql.includes("UPDATE SERVICIOTECNICO")) {
      return { rows: [] };
    }
    return { rows: [] };
  },
  release: async () => { },
};

pool.connect = async () => Promise.resolve(mockClient);

// Prueba: createServicioTecnico
async function testCreateServicioTecnico() {
  console.log("🔍 Test: createServicioTecnico");

  const req = {
    body: {
      id_cliente: 203,
      id_sede: 103,
      id_proveedor: 'PROV_TEST',
      nombre_servicio: 'Reparación de software',
      descripcion_servicio: 'Instalación de sistema operativo',
      fecha_servicio: '2024-05-18T00:00:00.000Z',
      fecha_entrega: '2024-05-23T00:00:00.000Z',
      tipo_dano: 'Software',
      clave_dispositivo: 'IJKL789',
      costo: 80,
      abono: 20,
      garantia_aplica: true,
      fecha_garantia: '2024-06-18T00:00:00.000Z',
      numero_contacto_alternativo: '555-9012',
      autorizado: true,
      metodos_pago: [{ id_tipo: 105, monto: 20 }]
    }
  };
  const res = mockResponse();

  await servicioTecnicoController.createServicioTecnico(req, res);

  console.assert(res.statusCode === 201, "❌ Código incorrecto");
  console.assert(res.data.servicioTecnico.id_sede_serviciotecnico === 103, "❌ ID de sede incorrecto");
  console.assert(res.data.servicioTecnico.nombre_serviciotecnico === 'Reparación de software', "❌ Nombre de servicio incorrecto");
  console.log("✅ createServicioTecnico pasó la prueba\n");
}


const serviciosTecnicosMock = {
    rows: [
      {
        id_serviciotecnico: 1,
        id_sede_serviciotecnico: 101,
        id_proveedor_serviciotecnico: 'PROV123',
        id_cliente_serviciotecnico: 201,
        id_factura_serviciotecnico: 301,
        nombre_serviciotecnico: 'Reparación de pantalla',
        descripcion_serviciotecnico: 'Reemplazo de pantalla LCD',
        fecha_serviciotecnico: '2024-05-15T00:00:00.000Z',
        fecha_entrega_serviciotecnico: '2024-05-18T00:00:00.000Z',
        tipo_dano_serviciotecnico: 'Hardware',
        clave_dispositivo_serviciotecnico: 'ABCD123',
        costo_serviciotecnico: 150,
        abono_serviciotecnico: 50,
        garantia_aplica_serviciotecnico: true,
        fecha_garantia_serviciotecnico: '2024-06-15T00:00:00.000Z',
        numero_contacto_alternativo_servicio: '555-1234',
        autorizado_serviciotecnico: true,
        estado_serviciotecnico: 'A' // Activo
      },
      {
        id_serviciotecnico: 2,
        id_sede_serviciotecnico: 102,
        id_proveedor_serviciotecnico: 'PROV456',
        id_cliente_serviciotecnico: 202,
        id_factura_serviciotecnico: 302,
        nombre_serviciotecnico: 'Reparación de batería',
        descripcion_serviciotecnico: 'Reemplazo de batería',
        fecha_serviciotecnico: '2024-05-16T00:00:00.000Z',
        fecha_entrega_serviciotecnico: '2024-05-19T00:00:00.000Z',
        tipo_dano_serviciotecnico: 'Hardware',
        clave_dispositivo_serviciotecnico: 'EFGH456',
        costo_serviciotecnico: 80,
        abono_serviciotecnico: 0,
        garantia_aplica_serviciotecnico: false,
        fecha_garantia_serviciotecnico: null,
        numero_contacto_alternativo_servicio: '555-5678',
        autorizado_serviciotecnico: true,
        estado_serviciotecnico: 'A' // Activo
      },
      {
        id_serviciotecnico: 3,
        id_sede_serviciotecnico: 103,
        id_proveedor_serviciotecnico: 'PROV789',
        id_cliente_serviciotecnico: 203,
        id_factura_serviciotecnico: 303,
        nombre_serviciotecnico: 'Reparación de software',
        descripcion_serviciotecnico: 'Instalación de sistema operativo',
        fecha_serviciotecnico: '2024-05-18T00:00:00.000Z',
        fecha_entrega_serviciotecnico: '2024-05-23T00:00:00.000Z',
        tipo_dano_serviciotecnico: 'Software',
        clave_dispositivo_serviciotecnico: 'IJKL789',
        costo_serviciotecnico: 80,
        abono_serviciotecnico: 20,
        garantia_aplica_serviciotecnico: true,
        fecha_garantia_serviciotecnico: '2024-06-18T00:00:00.000Z',
        numero_contacto_alternativo_servicio: '555-9012',
        autorizado_serviciotecnico: true,
        estado_serviciotecnico: 'I' // Inactivo
      }
    ]
  }

// Prueba: getServiciosTecnicos
async function testGetServiciosTecnicos() {
    console.log("🔍 Test: getServiciosTecnicos");
  
    pool.query = async () => ({
      rows: serviciosTecnicosMock.rows.filter(st => st.estado_serviciotecnico === 'A')
    });
  
    const req = {};
    const res = mockResponse();
  
    await servicioTecnicoController.getServiciosTecnicos(req, res);
  
    console.assert(res.statusCode === 200, "❌ Código incorrecto");
    console.assert(Array.isArray(res.data), "❌ No devolvió un array");
    console.assert(res.data.length === 2, "❌ Cantidad de servicios técnicos incorrecta");
    console.assert(res.data[0].nombre_serviciotecnico === 'Reparación de pantalla', "❌ Nombre del servicio incorrecto");
    console.log("✅ getServiciosTecnicos pasó la prueba\n");
  }



// Prueba: getServicioTecnicoById
async function testGetServicioTecnicoById() {
    console.log("🔍 Test: getServicioTecnicoById");
  
    pool.query = async (sql, params) => {
      if (params[0] === 1) {
        return { rows: [serviciosTecnicosMock.rows[0]] };
      } else if (params[0] === 999) {
        return { rows: [] };
      }
      return { rows: [] };
    };
  
    const reqExistente = { params: { id: 1 } };
    const resExistente = mockResponse();
  
    await servicioTecnicoController.getServicioTecnicoById(reqExistente, resExistente);
  
    console.assert(resExistente.statusCode === 200, "❌ Código incorrecto para existente");
    console.assert(resExistente.data.nombre_serviciotecnico === 'Reparación de pantalla', "❌ Nombre del servicio incorrecto para existente");
    console.log("✅ getServicioTecnicoById (existente) pasó la prueba\n");
  
    const reqNoExistente = { params: { id: 999 } };
    const resNoExistente = mockResponse();
    resNoExistente.status = (code) => { resNoExistente.statusCode = code; return resNoExistente; };
  
    await servicioTecnicoController.getServicioTecnicoById(reqNoExistente, resNoExistente);
  
    console.assert(resNoExistente.statusCode === 404, "❌ Código incorrecto para no existente");
    console.assert(resNoExistente.data.error === "Servicio técnico no encontrado", "❌ Mensaje de error incorrecto para no existente");
    console.log("✅ getServicioTecnicoById (no existente) pasó la prueba\n");
  }

//Ejecutar las pruebas
(async function runTests() {
  await testCreateServicioTecnico();
  await testGetServiciosTecnicos();
  await testGetServicioTecnicoById();
})();