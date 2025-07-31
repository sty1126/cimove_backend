import * as service from "./tiposCliente.service.js";

export const getTiposClienteController = async (req, res) => {
  try {
    const tipos = await service.getTiposCliente();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de cliente:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
