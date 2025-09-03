import * as rentabilidadRepo from "./estadisticasGenerales.repository.js";

/**
 * Obtiene el beneficio neto en un rango de fechas
 */
export const getRentabilidad = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return rentabilidadRepo.obtenerRentabilidad(fechaInicio, fechaFin);
};

/**
 * Obtiene la evolución de la rentabilidad para gráficas
 */
export const getEvolucionRentabilidad = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return rentabilidadRepo.obtenerEvolucionRentabilidad(fechaInicio, fechaFin);
};
