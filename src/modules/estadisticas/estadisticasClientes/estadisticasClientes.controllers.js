import * as clientesService from "./estadisticasClientes.service.js";

/**
 * Obtiene la cantidad de clientes activos por período
 */
export const getClientesActivosPorPeriodoController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const resultado = await clientesService.getClientesActivosPorPeriodo(fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Obtiene los mejores clientes por volumen de compra
 */
export const getMejoresClientesController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, limite } = req.query;
    const resultado = await clientesService.getMejoresClientes(fechaInicio, fechaFin, parseInt(limite) || 10);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getClientesPorSedeController = async (req, res) => {
  try {
    const resultado = await clientesService.getClientesPorSede();
    res.json(resultado); 
  } catch (error) {
    console.error("Error en getClientesPorSedeController:", error);
    res.status(500).json({ error: "Error al obtener clientes por sede" });
  }
};
