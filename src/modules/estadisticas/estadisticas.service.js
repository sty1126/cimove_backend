import * as repo from "./estadisticas.repository.js";

export const getTopProductosPorCantidad = repo.obtenerTopProductosPorCantidad;
export const getTopProductosPorValor = repo.obtenerTopProductosPorValor;
export const getProductosMasFrecuentes = repo.obtenerProductosMasFrecuentes;
export const getStockVsVentas = repo.obtenerStockVsVentas;
export const getProductosBajoStockAltaDemanda = repo.obtenerProductosBajoStockAltaDemanda;
export const getProductosObsoletos = repo.obtenerProductosObsoletos;

export const getTopClientesPorMonto = repo.obtenerTopClientesPorMonto;
export const getTopClientesPorCantidad = repo.obtenerTopClientesPorCantidad;
export const getTopClientesPorFrecuencia = repo.obtenerTopClientesPorFrecuencia;
export const getClientesFrecuentesVsEsporadicos = repo.obtenerClientesFrecuentesVsEsporadicos;
export const getClientesConPagosPendientes = repo.obtenerClientesConPagosPendientes;

export const getIngresosPorDia = repo.obtenerIngresosPorDia;
export const getIngresosPorMes = repo.obtenerIngresosPorMes;
export const getIngresosPorAnio = repo.obtenerIngresosPorAnio;
export const getTotalFacturado = repo.obtenerTotalFacturado;
export const getTotalPagado = repo.obtenerTotalPagado;
export const getIngresosPorMetodoPago = repo.obtenerIngresosPorMetodoPago;
export const getComparacionFacturadoRecibido = repo.obtenerComparacionFacturadoRecibido;

export const getVentasPorSede = repo.obtenerVentasPorSede;
export const getVentasPorSedePorAnio = repo.obtenerVentasPorSedePorAnio;
export const getVentasPorSedePorMes = repo.obtenerVentasPorSedePorMes;
export const getVentasPorSedePorDia = repo.obtenerVentasPorSedePorDia;

export const getPagosProveedoresTotales = repo.obtenerPagosProveedoresTotales;
export const getPagosPorProveedor = repo.obtenerPagosPorProveedor;
export const getPagosProveedoresPorMes = repo.obtenerPagosProveedoresPorMes;

export const getNominaPorSedeYRol = repo.obtenerNominaPorSedeYRol;
