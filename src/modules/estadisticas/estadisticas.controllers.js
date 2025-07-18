import * as service from "./estadisticas.service.js";


export const getTopProductosPorCantidadController = (req, res) => service.getTopProductosPorCantidad(res);
export const getTopProductosPorValorController = (req, res) => service.getTopProductosPorValor(res);
export const getProductosMasFrecuentesController = (req, res) => service.getProductosMasFrecuentes(res);
export const getStockVsVentasController = (req, res) => service.getStockVsVentas(res);
export const getProductosBajoStockAltaDemandaController = (req, res) => service.getProductosBajoStockAltaDemanda(res);
export const getProductosObsoletosController = (req, res) => service.getProductosObsoletos(res);

export const getTopClientesPorMontoController = (req, res) => service.getTopClientesPorMonto(res);
export const getTopClientesPorCantidadController = (req, res) => service.getTopClientesPorCantidad(res);
export const getTopClientesPorFrecuenciaController = (req, res) => service.getTopClientesPorFrecuencia(res);
export const getClientesFrecuentesVsEsporadicosController = (req, res) => service.getClientesFrecuentesVsEsporadicos(res);
export const getClientesConPagosPendientesController = (req, res) => service.getClientesConPagosPendientes(res);

export const getIngresosPorDiaController = (req, res) => service.getIngresosPorDia(res);
export const getIngresosPorMesController = (req, res) => service.getIngresosPorMes(res);
export const getIngresosPorAnioController = (req, res) => service.getIngresosPorAnio(res);
export const getTotalFacturadoController = (req, res) => service.getTotalFacturado(res);
export const getTotalPagadoController = (req, res) => service.getTotalPagado(res);
export const getIngresosPorMetodoPagoController = (req, res) => service.getIngresosPorMetodoPago(res);
export const getComparacionFacturadoRecibidoController = (req, res) => service.getComparacionFacturadoRecibido(res);

export const getVentasPorSedeController = (req, res) => service.getVentasPorSede(res);
export const getVentasPorSedePorAnioController = (req, res) => service.getVentasPorSedePorAnio(res);
export const getVentasPorSedePorMesController = (req, res) => service.getVentasPorSedePorMes(res);
export const getVentasPorSedePorDiaController = (req, res) => service.getVentasPorSedePorDia(res);

export const getPagosProveedoresTotalesController = (req, res) => service.getPagosProveedoresTotales(res);
export const getPagosPorProveedorController = (req, res) => service.getPagosPorProveedor(res);
export const getPagosProveedoresPorMesController = (req, res) => service.getPagosProveedoresPorMes(res);

export const getNominaPorSedeYRolController = (req, res) => service.getNominaPorSedeYRol(res);
