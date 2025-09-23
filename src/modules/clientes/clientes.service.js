import * as repository from "./clientes.repository.js";
import { pool } from "../../db.js";

// Obtener todos los clientes
export const getClientes = async () => {
  try {
    return await repository.obtenerClientes();
  } catch (error) {
    throw new Error(`Error al obtener clientes: ${error.message}`);
  }
};

// Obtener clientes naturales
export const getClientesNaturales = async () => {
  try {
    return await repository.findClientesNaturales();
  } catch (error) {
    throw new Error(`Error al obtener clientes naturales: ${error.message}`);
  }
};

// Obtener clientes jurídicos
export const getClientesJuridicos = async () => {
  try {
    return await repository.findClientesJuridicos();
  } catch (error) {
    throw new Error(`Error al obtener clientes jurídicos: ${error.message}`);
  }
};

// Obtener cliente por ID
export const getClienteById = async (id) => {
  try {
    const cliente = await repository.obtenerClientePorId(id);
    if (!cliente) {
      throw new Error("Cliente no encontrado");
    }
    return cliente;
  } catch (error) {
    throw new Error(`Error al obtener cliente: ${error.message}`);
  }
};

// Obtener tipos de cliente
export const getTiposCliente = async () => {
  try {
    return await repository.findTiposCliente();
  } catch (error) {
    throw new Error(`Error al obtener tipos de cliente: ${error.message}`);
  }
};

// Crear nuevo cliente

export const createCliente = async (clienteData) => {
  try {
    const {
      id_cliente,
      id_tipodocumento_cliente,
      id_tipocliente_cliente,
      telefono_cliente,
      id_sede_cliente,
    } = clienteData;

    if (
      !id_cliente ||
      !id_tipodocumento_cliente ||
      !id_tipocliente_cliente ||
      !telefono_cliente ||
      !id_sede_cliente
    ) {
      throw new Error(
        "Faltan campos obligatorios: id_cliente, id_tipodocumento_cliente, id_tipocliente_cliente, telefono_cliente, id_sede_cliente"
      );
    }

    const datosCompletos = {
      ...clienteData,
      estado_cliente: clienteData.estado_cliente || "A",
    };

    return await repository.crearCliente(datosCompletos);
  } catch (error) {
    console.error("Error detallado en createCliente:", error);
    throw new Error(`Error al crear cliente: ${error.message}`);
  }
};

// Obtener clientes formateados
export const getClientesFormateados = async () => {
  try {
    const clientes = await repository.findClientesFormateados();

    if (!Array.isArray(clientes)) {
      throw new Error("La consulta no devolvió un array.");
    }

    return clientes.map((cliente) => ({
      id: cliente.id_cliente,
      nombre:
        cliente.descripcion_tipocliente === "Persona Natural"
          ? `${cliente.nombre_cliente} ${cliente.apellido_cliente}`
          : cliente.representante_cliente,
      razon_social:
        cliente.descripcion_tipocliente === "Persona Jurídica"
          ? cliente.razonsocial_cliente
          : "No aplica",
      tipo: cliente.descripcion_tipocliente === "Persona Jurídica" ? "J" : "N",
    }));
  } catch (error) {
    throw new Error(`Error al obtener clientes formateados: ${error.message}`);
  }
};

// Actualizar cliente
export const updateCliente = async (id, clienteData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const datosActualizados = {
      ...clienteData,
      estado_cliente: clienteData.estado_cliente || "A",
    };

    await repository.actualizarCliente(id, datosActualizados);

    await client.query("COMMIT");
    return { message: "Cliente actualizado correctamente" };
  } catch (error) {
    await client.query("ROLLBACK");
    throw new Error(`Error al actualizar cliente: ${error.message}`);
  } finally {
    client.release();
  }
};

export const deleteCliente = async (id) => {
  try {
    const eliminado = await repository.eliminarCliente(id);
    return eliminado; // null si no existe
  } catch (error) {
    throw new Error(`Error al eliminar cliente: ${error.message}`);
  }
};


// Obtener clientes por sede
export const getClientesPorSede = async (idSede) => {
  try {
    if (!idSede) {
      throw new Error("Se requiere el ID de la sede");
    }
    const clientes = await repository.obtenerClientesPorSede(idSede);

    if (!Array.isArray(clientes)) {
      throw new Error("La consulta no devolvió un array.");
    }

    return clientes.map((cliente) => ({
      id: cliente.id_cliente,
      nombre:
        cliente.descripcion_tipocliente === "Persona Natural"
          ? `${cliente.nombre_cliente} ${cliente.apellido_cliente}`
          : cliente.representante_cliente,
      razon_social:
        cliente.descripcion_tipocliente === "Persona Jurídica"
          ? cliente.razonsocial_cliente
          : "No aplica",
      tipo: cliente.descripcion_tipocliente === "Persona Jurídica" ? "J" : "N",
      id_sede: cliente.id_sede_cliente,
    }));
  } catch (error) {
    throw new Error(`Error al obtener clientes por sede: ${error.message}`);
  }
};
