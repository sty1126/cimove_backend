import * as ventasRepo from "./estadisticasIngresos.repository.js";

/**
 * Obtiene las ventas por día de la semana
 */
export const getVentasPorDiaSemana = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerVentasPorDiaSemana(fechaInicio, fechaFin);
};

/**
 * Obtiene datos para un mapa de calor de ventas por día de la semana
 */
export const getMapaCalorVentas = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerMapaCalorVentas(fechaInicio, fechaFin);
};

/**
 * Obtiene ingresos por categoría
 */
export const getIngresosPorCategoria = (fechaInicio, fechaFin, limite = 10) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerIngresosPorCategoria(fechaInicio, fechaFin, limite);
};

/**
 * Obtiene ingresos totales por día
 */
export const getIngresosPorPeriodo = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerIngresosPorPeriodo(fechaInicio, fechaFin);
};

/**
 * Obtiene ventas por sede
 */
export const getVentasPorSede = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerVentasPorSede(fechaInicio, fechaFin);
};

/**
 * Obtiene ingresos por método de pago
 */
export const getIngresosPorMetodoPago = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerIngresosPorMetodoPago(fechaInicio, fechaFin);
};

/**
 * Obtiene ingresos por método de pago y sede
 */
export const getIngresosPorMetodoPagoYSede = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return ventasRepo.obtenerIngresosPorMetodoPagoYSede(fechaInicio, fechaFin);
};
