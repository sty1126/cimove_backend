import * as clientesRepo from "./estadisticasClientes.repository.js";

/**
 * Obtiene la cantidad de clientes activos por período
 */
export const getClientesActivosPorPeriodo = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return clientesRepo.obtenerClientesActivosPorPeriodo(fechaInicio, fechaFin);
};

/**
 * Obtiene los mejores clientes por volumen de compra
 */
export const getMejoresClientes = (fechaInicio, fechaFin, limite = 10) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  if (limite <= 0) limite = 10;
  return clientesRepo.obtenerMejoresClientes(fechaInicio, fechaFin, limite);
};

/**
 * Obtiene clientes agrupados por sede
 */
export const getClientesPorSede = () => {
  return clientesRepo.obtenerClientesPorSede();
};
