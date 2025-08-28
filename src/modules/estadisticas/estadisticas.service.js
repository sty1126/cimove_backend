// estadisticas.service.js
import * as estadisticasRepo from "./estadisticas.repository.js";

// Servicios para estadísticas de productos
export const getTopProductosPorCantidad = (limite = 10) => {
  return estadisticasRepo.obtenerTopProductosPorCantidad(limite);
};

export const getTopProductosPorValor = (limite = 10) => {
  return estadisticasRepo.obtenerTopProductosPorValor(limite);
};

export const getProductosFrecuentes = (limite = 10) => {
  return estadisticasRepo.obtenerProductosFrecuentes(limite);
};

export const getStockVsVentas = (limite = 100) => {
  return estadisticasRepo.obtenerStockVsVentas(limite);
};

export const getProductosObsoletos = (diasSinVenta = 90, limite = 20) => {
  if (diasSinVenta < 0 || limite < 1) {
    throw new Error("Parámetros inválidos para obtener productos obsoletos");
  }
  return estadisticasRepo.obtenerProductosObsoletos(diasSinVenta, limite);
};

// Servicios para estadísticas de clientes
export const getTopClientesPorMonto = (limite = 10) => {
  return estadisticasRepo.obtenerTopClientesPorMonto(limite);
};

export const getTopClientesPorCantidad = (limite = 10) => {
  return estadisticasRepo.obtenerTopClientesPorCantidad(limite);
};

export const getTopClientesPorFrecuencia = (limite = 10, periodoMeses = 6) => {
  if (periodoMeses < 1 || limite < 1) {
    throw new Error("Parámetros inválidos para obtener clientes por frecuencia");
  }
  return estadisticasRepo.obtenerTopClientesPorFrecuencia(limite, periodoMeses);
};

export const getClientesFrecuentesVsEsporadicos = (limite = 50, periodoMeses = 3) => {
  if (periodoMeses < 1 || limite < 1) {
    throw new Error("Parámetros inválidos para clasificar clientes");
  }
  return estadisticasRepo.obtenerClientesFrecuentesVsEsporadicos(limite, periodoMeses);
};

export const getClientesConPagosPendientes = (limite = 20) => {
  return estadisticasRepo.obtenerClientesConPagosPendientes(limite);
};

// Servicios para ingresos
export const getIngresosTotales = async (fechaInicio, fechaFin) => {
  return await estadisticasFinancierasRepo.obtenerIngresosTotales(fechaInicio, fechaFin);
};

export const getIngresosPorDia = async (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Se requieren fecha de inicio y fin para obtener ingresos por día");
  }
  return await estadisticasFinancierasRepo.obtenerIngresosPorDia(fechaInicio, fechaFin);
};

export const getIngresosPorMes = async (anio) => {
  if (!anio) {
    const currentYear = new Date().getFullYear();
    anio = currentYear;
  }
  return await estadisticasFinancierasRepo.obtenerIngresosPorMes(anio);
};

export const getIngresosPorMetodoPago = async (fechaInicio, fechaFin) => {
  return await estadisticasFinancierasRepo.obtenerIngresosPorMetodoPago(fechaInicio, fechaFin);
};

// Servicios para ventas por sede
export const getVentasPorSede = async (fechaInicio, fechaFin) => {
  return await estadisticasFinancierasRepo.obtenerVentasPorSede(fechaInicio, fechaFin);
};

export const getVentasPorSedePorMes = async (anio) => {
  if (!anio) {
    const currentYear = new Date().getFullYear();
    anio = currentYear;
  }
  return await estadisticasFinancierasRepo.obtenerVentasPorSedePorMes(anio);
};

export const getVentasPorSedePorDia = async (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) {
    throw new Error("Se requieren fecha de inicio y fin para obtener ventas por sede y día");
  }
  return await estadisticasFinancierasRepo.obtenerVentasPorSedePorDia(fechaInicio, fechaFin);
};

// Servicios para proveedores
export const getPagosProveedoresTotales = async (fechaInicio, fechaFin) => {
  return await estadisticasFinancierasRepo.obtenerPagosProveedoresTotales(fechaInicio, fechaFin);
};

export const getPagosProveedoresPorMes = async (anio) => {
  if (!anio) {
    const currentYear = new Date().getFullYear();
    anio = currentYear;
  }
  return await estadisticasFinancierasRepo.obtenerPagosProveedoresPorMes(anio);
};

// Servicio para nómina
export const getNominaPorSedeYRol = async (fechaInicio, fechaFin) => {
  return await estadisticasFinancierasRepo.obtenerNominaPorSedeYRol(fechaInicio, fechaFin);
};

// Servicio combinado para el dashboard financiero
export const getDashboardFinanciero = async (anio) => {
  if (!anio) {
    const currentYear = new Date().getFullYear();
    anio = currentYear;
  }
  
  try {
    const [
      ingresosPorMes,
      ventasPorSede,
      pagosPorMes,
      topClientes
    ] = await Promise.all([
      getIngresosPorMes(anio),
      getVentasPorSede(),
      getPagosProveedoresPorMes(anio),
      getTopClientesPorMonto(5)
    ]);
    
    return {
      ingresosPorMes,
      ventasPorSede,
      pagosPorMes,
      topClientes
    };
  } catch (error) {
    console.error("Error al obtener datos del dashboard financiero:", error);
    throw new Error("Error al obtener datos del dashboard financiero");
  }
};
