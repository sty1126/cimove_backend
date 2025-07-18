import * as ciudadService from "./ciudades.service.js";

export const getCiudadesController = async (req, res) => {
  try {
    const ciudades = await ciudadService.getCiudades();
    res.json(ciudades);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener ciudades" });
  }
};

export const createCiudadController = async (req, res) => {
  try {
    const nueva = await ciudadService.createCiudad(req.body);
    res.status(201).json(nueva);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
