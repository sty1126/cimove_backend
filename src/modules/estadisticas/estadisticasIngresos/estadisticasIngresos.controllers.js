import * as ventasService from "./estadisticasIngresos.service.js";

/**
 * Ventas por día de la semana
 */
export const getVentasPorDiaSemanaController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getVentasPorDiaSemana(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Mapa de calor de ventas
 */
export const getMapaCalorVentasController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getMapaCalorVentas(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Ingresos por categoría
 */
export const getIngresosPorCategoriaController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limite } = req.query;
    const resultado = await ventasService.getIngresosPorCategoria(fechaInicio, fechaFin, parseInt(limite) || 10);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Ingresos totales por período
 */
export const getIngresosPorPeriodoController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getIngresosPorPeriodo(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Ventas por sede
 */
export const getVentasPorSedeController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getVentasPorSede(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Ingresos por método de pago
 */
export const getIngresosPorMetodoPagoController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getIngresosPorMetodoPago(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Ingresos por método de pago y sede
 */
export const getIngresosPorMetodoPagoYSedeController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await ventasService.getIngresosPorMetodoPagoYSede(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
