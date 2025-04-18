import { pool } from '../../db.js';
import {
  getClientes,
  getClientesNaturales,
  getClientesJuridicos,
  getClienteById,
  getTiposCliente,
  createCliente,
  getClientesFormateados,
} from '../../controllers/clientes.controllers.js';


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

//  Mock dinámico para pool.query según la consulta
pool.query = async (query, params) => {
  if (query.includes("FROM CLIENTE") && query.includes("CLIENTENATURAL") && query.includes("CLIENTEJURIDICO") && query.includes("WHERE C.ID_CLIENTE = $1")) {
    if (params[0] === "existe") {
      return {
        rows: [
          {
            id_cliente: "existe",
            descripcion_tipocliente: "Persona Natural",
            nombre_cliente: "Juan",
            apellido_cliente: "Pérez",
            razonsocial_cliente: null,
          },
        ],
      };
    } else {
      return { rows: [] };
    }
  }

  if (query.includes("SELECT * FROM TIPOCLIENTE")) {
    return { rows: [{ id: 1, descripcion: "Natural" }, { id: 2, descripcion: "Jurídico" }] };
  }

  if (query.startsWith("INSERT INTO CLIENTE")) {
    return { rows: [{ id_cliente: "nuevo-id" }] };
  }

  if (query.startsWith("INSERT INTO CLIENTENATURAL")) {
    return {}; // no importa el resultado
  }

  if (query.startsWith("INSERT INTO CLIENTEJURIDICO")) {
    return {}; // no importa el resultado
  }

  if (query.includes("FROM CLIENTE") && query.includes("CLIENTENATURAL") && query.includes("CLIENTEJURIDICO")) {
    return {
      rows: [
        {
          id_cliente: "123",
          descripcion_tipocliente: "Persona Jurídica",
          razonsocial_cliente: "Empresa XYZ",
          representante_cliente: "Carlos Legal",
        },
        {
          id_cliente: "124",
          descripcion_tipocliente: "Persona Natural",
          nombre_cliente: "Ana",
          apellido_cliente: "Gómez",
        },
      ],
    };
  }

  return { rows: [] };
};

console.log("=== Test: getClientes ===");
await getClientes({}, createMockResponse());

console.log("\n=== Test: getClientesNaturales ===");
await getClientesNaturales({}, createMockResponse());

console.log("\n=== Test: getClientesJuridicos ===");
await getClientesJuridicos({}, createMockResponse());

console.log("\n=== Test: getClienteById (existe) ===");
await getClienteById({ params: { id: "existe" } }, createMockResponse());

console.log("\n=== Test: getClienteById (no existe) ===");
await getClienteById({ params: { id: "no-existe" } }, createMockResponse());

console.log("\n=== Test: getTiposCliente ===");
await getTiposCliente({}, createMockResponse());

console.log("\n=== Test: createCliente (natural) ===");
await createCliente(
  {
    body: {
      id_tipo_cliente: 1,
      datos: {
        nombre: "Luis",
        apellido: "Rodríguez",
        fecha_nacimiento: "1990-01-01",
        genero: "M",
      },
    },
  },
  createMockResponse()
);

console.log("\n=== Test: createCliente (jurídico) ===");
await createCliente(
  {
    body: {
      id_tipo_cliente: 2,
      datos: {
        razon_social: "Mi Empresa S.A.",
        nombre_comercial: "Empresa",
        representante: "Diana Gerente",
        digito_verificacion: "5",
      },
    },
  },
  createMockResponse()
);

console.log("\n=== Test: getClientesFormateados ===");
await getClientesFormateados({}, createMockResponse());
