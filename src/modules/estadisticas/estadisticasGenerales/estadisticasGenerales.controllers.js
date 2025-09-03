import * as rentabilidadService from "./estadisticasGenerales.service.js";

/**
 * Obtiene el beneficio neto en un rango de fechas
 */
export const getRentabilidadController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await rentabilidadService.getRentabilidad(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene la evolución de la rentabilidad para gráficas
 */
export const getEvolucionRentabilidadController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await rentabilidadService.getEvolucionRentabilidad(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
