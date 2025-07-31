// servicioTecnico.controllers.js
import * as stService from "./servicioTecnico.service.js";

export const createServicioTecnico = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ error: "No se envió body en la solicitud" });
    }
    const result = await stService.createServicioTecnico(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al crear servicio técnico:", error);
    res.status(400).json({ error: error.message || "Error interno del servidor al crear servicio técnico" });
  }
};

export const getServiciosTecnicos = async (req, res) => {
  try {
    const servicios = await stService.getServiciosTecnicos();
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor al obtener servicios técnicos" });
  }
};

export const getServicioTecnicoById = async (req, res) => {
  try {
    const { id } = req.params;
    const servicio = await stService.getServicioTecnicoById(id);
    res.json(servicio);
  } catch (error) {
    console.error("Error al obtener servicio técnico por ID:", error);
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor al obtener servicio técnico por ID" });
  }
};

export const updateServicioTecnico = async (req, res) => {
  try {
    const { id } = req.params;
    await stService.updateServicioTecnico(id, req.body);
    res.json({ mensaje: "Servicio técnico actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar servicio técnico:", error);
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error interno del servidor al actualizar servicio técnico" });
  }
};