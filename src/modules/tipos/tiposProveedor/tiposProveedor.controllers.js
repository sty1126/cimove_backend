import * as service from "./tiposProveedor.service.js";

export const getTiposProveedorController = async (req, res) => {
  try {
    const tipos = await service.getTiposProveedor();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de proveedor:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createTipoProveedorController = async (req, res) => {
  try {
    const tipo = await service.createTipoProveedor(req.body);
    res.status(201).json(tipo);
  } catch (error) {
    console.error("Error al crear tipo de proveedor:", error.message);
    res.status(400).json({ error: error.message });
  }
};
