import * as productoService from "./estadisticasProductos.service.js";

/**
 * Productos con bajo stock
 */
export const getProductosBajoStockController = async (req, res) => {
  try {
    const { limite } = req.query;
    const resultado = await productoService.getProductosBajoStock(parseInt(limite) || 20);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Histórico de ventas de un producto
 */
export const getHistoricoVentasProductoController = async (req, res) => {
  try {
    const { idProducto, fechaInicio, fechaFin } = req.query;
    if (!idProducto || !fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar idProducto, fechaInicio y fechaFin" });
    }
    const resultado = await productoService.getHistoricoVentasProducto(idProducto, fechaInicio, fechaFin);
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Productos más vendidos
 */
export const getProductosMasVendidosController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, ordenarPor, limite } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar fechaInicio y fechaFin" });
    }
    const resultado = await productoService.getProductosMasVendidos(
      fechaInicio,
      fechaFin,
      ordenarPor || 'unidades',
      parseInt(limite) || 10
    );
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Productos más vendidos por sede
 */
export const getProductosMasVendidosPorSedeController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin, idSede, limite } = req.query;
    if (!fechaInicio || !fechaFin) {
      return res.status(400).json({ error: "Debe especificar fechaInicio y fechaFin" });
    }
    const resultado = await productoService.getProductosMasVendidosPorSede(
      fechaInicio,
      fechaFin,
      idSede || null,
      parseInt(limite) || 10
    );
    res.json(resultado);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
