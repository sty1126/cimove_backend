import * as service from "./servicioTecnico.service.js";

export const createServicioTecnico = (req, res) => service.createServicioTecnico(req, res);
export const getServiciosTecnicos = (req, res) => service.getServiciosTecnicos(req, res);
export const updateServicioTecnico = (req, res) => service.updateServicioTecnico(req, res);
export const getServicioTecnicoById = (req, res) => service.getServicioTecnicoById(req, res);
