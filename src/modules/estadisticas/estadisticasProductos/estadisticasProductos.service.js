import * as productoRepo from "./estadisticasProductos.repository.js";

/**
 * Obtiene productos con bajo stock
 */
export const getProductosBajoStock = (limite = 20) => {
  return productoRepo.obtenerProductosBajoStock(limite);
};

/**
 * Obtiene histórico de ventas de un producto
 */
export const getHistoricoVentasProducto = (idProducto, fechaInicio, fechaFin) => {
  if (!idProducto || !fechaInicio || !fechaFin) {
    throw new Error("Debe especificar idProducto, fechaInicio y fechaFin");
  }
  return productoRepo.obtenerHistoricoVentasProducto(idProducto, fechaInicio, fechaFin);
};

/**
 * Obtiene los productos más vendidos
 */
export const getProductosMasVendidos = (fechaInicio, fechaFin, ordenarPor = 'unidades', limite = 10) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return productoRepo.obtenerProductosMasVendidos(fechaInicio, fechaFin, ordenarPor, limite);
};

/**
 * Obtiene los productos más vendidos por sede
 */
export const getProductosMasVendidosPorSede = (fechaInicio, fechaFin, idSede = null, limite = 10) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Debe especificar fechaInicio y fechaFin");
  }
  return productoRepo.obtenerProductosMasVendidosPorSede(fechaInicio, fechaFin, idSede, limite);
};
