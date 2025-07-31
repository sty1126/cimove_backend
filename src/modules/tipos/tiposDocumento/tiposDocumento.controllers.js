import * as service from "./tiposDocumento.service.js";

export const getTiposDocumentoController = async (req, res) => {
  try {
    const tipos = await service.getTiposDocumento();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
