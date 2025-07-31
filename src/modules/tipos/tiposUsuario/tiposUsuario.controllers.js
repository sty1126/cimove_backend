import * as tuService from "./tiposUsuario.service.js";

export const getTiposUsuario = async (req, res) => {
  try {
    const tiposUsuario = await tuService.getActiveTiposUsuario();
    res.json(tiposUsuario);
  } catch (error) {
    console.error("Error al obtener tipos de usuario:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener tipos de usuario" });
  }
};