import * as egresosService from "./estadisticasEgresos.service.js";

/**
 * Obtiene egresos totales por período
 */
export const getEgresosPorPeriodoController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await egresosService.getEgresosPorPeriodo(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene los principales egresos por proveedor
 */
export const getPrincipalesEgresosController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limite } = req.query;
    const resultado = await egresosService.getPrincipalesEgresos(
      fechaInicio, 
      fechaFin, 
      parseInt(limite) || 10
    );
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
