import * as service from "./clientes.service.js";

// Obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await service.getClientes();
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientes:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener clientes naturales
export const getClientesNaturales = async (req, res) => {
  try {
    const clientes = await service.getClientesNaturales();
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientesNaturales:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener clientes jurídicos
export const getClientesJuridicos = async (req, res) => {
  try {
    const clientes = await service.getClientesJuridicos();
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientesJuridicos:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const cliente = await service.getClienteById(id);
    res.json(cliente);
  } catch (error) {
    console.error("Error en getClienteById:", error);
    if (error.message === "Cliente no encontrado") {
      res.status(404).json({ error: error.message });
    } else {
      res.status(500).json({ error: error.message });
    }
  }
};

// Obtener tipos de cliente
export const getTiposCliente = async (req, res) => {
  try {
    const tipos = await service.getTiposCliente();
    res.json(tipos);
  } catch (error) {
    console.error("Error en getTiposCliente:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo cliente
export const createCliente = async (req, res) => {
  try {
    //console.log("📥 Datos recibidos en el controlador para crear:", req.body);
    const result = await service.createCliente(req.body);
    res.status(201).json(result);
  } catch (error) {
    //console.error("❌ Error en createCliente:", error);
    res.status(400).json({ error: error.message }); // <-- devuelve mensaje real
  }
};

// Obtener clientes formateados
export const getClientesFormateados = async (req, res) => {
  try {
    const clientes = await service.getClientesFormateados();
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientesFormateados:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar cliente
export const updateCliente = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`📥 Datos recibidos en el controlador para actualizar cliente ${id}:`, req.body);
    const result = await service.updateCliente(id, req.body);
    res.status(200).json(result);
  } catch (error) {
   // console.error("❌ Error en updateCliente:", error);
    res.status(400).json({ error: error.message }); 
  }
};

// Eliminar cliente
export const deleteCliente = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await service.deleteCliente(id);
    res.status(200).json(result);
  } catch (error) {
    console.error("❌ Error en deleteCliente:", error);
    res.status(500).json({ error: error.message });
  }
};
