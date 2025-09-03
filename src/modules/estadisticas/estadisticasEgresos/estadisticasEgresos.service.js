import * as egresosRepo from "./estadisticasEgresos.repository.js";

/**
 * Obtiene egresos totales por día
 */
export const getEgresosPorPeriodo = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return egresosRepo.obtenerEgresosPorPeriodo(fechaInicio, fechaFin);
};

/**
 * Obtiene los principales egresos por proveedor
 */
export const getPrincipalesEgresos = (fechaInicio, fechaFin, limite = 10) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  if (limite <= 0) limite = 10;
  return egresosRepo.obtenerPrincipalesEgresos(fechaInicio, fechaFin, limite);
};
