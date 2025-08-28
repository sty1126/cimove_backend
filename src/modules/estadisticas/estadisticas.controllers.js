import * as estadisticasService from "./estadisticas.service.js";

// Controladores para estadísticas de productos
export const getTopProductosPorCantidadController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const productos = await estadisticasService.obtenerTopProductosPorCantidad(limite);
    res.json(productos);
  } catch (error) {
    console.error("Error en getTopProductosPorCantidadController:", error);
    res.status(500).json({ error: "Error al obtener los productos más vendidos por cantidad" });
  }
};

export const getTopProductosPorValorController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const productos = await estadisticasService.obtenerTopProductosPorValor(limite);
    res.json(productos);
  } catch (error) {
    console.error("Error en getTopProductosPorValorController:", error);
    res.status(500).json({ error: "Error al obtener los productos más vendidos por valor" });
  }
};

export const getProductosFrecuentesController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const productos = await estadisticasService.obtenerProductosFrecuentes(limite);
    res.json(productos);
  } catch (error) {
    console.error("Error en getProductosFrecuentesController:", error);
    res.status(500).json({ error: "Error al obtener los productos más frecuentes" });
  }
};

export const getStockVsVentasController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 100;
    const productos = await estadisticasService.obtenerStockVsVentas(limite);
    res.json(productos);
  } catch (error) {
    console.error("Error en getStockVsVentasController:", error);
    res.status(500).json({ error: "Error al obtener los datos de stock vs ventas" });
  }
};

export const getProductosObsoletosController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 20;
    const diasSinVenta = req.query.dias ? parseInt(req.query.dias) : 90;
    const productos = await estadisticasService.obtenerProductosObsoletos(diasSinVenta, limite);
    res.json(productos);
  } catch (error) {
    console.error("Error en getProductosObsoletosController:", error);
    res.status(500).json({ error: "Error al obtener los productos obsoletos" });
  }
};

export const getTopClientesPorCantidadController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const clientes = await estadisticasService.obtenerTopClientesPorCantidad(limite);
    res.json(clientes);
  } catch (error) {
    console.error("Error en getTopClientesPorCantidadController:", error);
    res.status(500).json({ error: "Error al obtener los clientes top por cantidad de compras" });
  }
};

export const getTopClientesPorFrecuenciaController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 10;
    const periodoMeses = req.query.meses ? parseInt(req.query.meses) : 6;
    const clientes = await estadisticasService.obtenerTopClientesPorFrecuencia(limite, periodoMeses);
    res.json(clientes);
  } catch (error) {
    console.error("Error en getTopClientesPorFrecuenciaController:", error);
    res.status(500).json({ error: "Error al obtener los clientes top por frecuencia" });
  }
};

export const getClientesFrecuentesVsEsporadicosController = async (req, res) => {
  try {
    const limite = req.query.limite ? parseInt(req.query.limite) : 50;
    const periodoMeses = req.query.meses ? parseInt(req.query.meses) : 3;
    const clientes = await estadisticasService.obtenerClientesFrecuentesVsEsporadicos(limite, periodoMeses);
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientesFrecuentesVsEsporadicosController:", error);
    res.status(500).json({ error: "Error al obtener la clasificación de clientes" });
  }
};

// Controladores para ingresos
export const getIngresosTotalesController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ingresos = await estadisticasFinancierasService.getIngresosTotales(fechaInicio, fechaFin);
    res.json(ingresos);
  } catch (error) {
    console.error("Error en getIngresosTotalesController:", error);
    res.status(500).json({ error: "Error al obtener ingresos totales" });
  }
};

export const getIngresosPorDiaController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ingresos = await estadisticasFinancierasService.getIngresosPorDia(fechaInicio, fechaFin);
    res.json(ingresos);
  } catch (error) {
    console.error("Error en getIngresosPorDiaController:", error);
    res.status(500).json({ error: "Error al obtener ingresos por día" });
  }
};

export const getIngresosPorMesController = async (req, res) => {
  try {
    const { anio } = req.query;
    const ingresos = await estadisticasFinancierasService.getIngresosPorMes(anio);
    res.json(ingresos);
  } catch (error) {
    console.error("Error en getIngresosPorMesController:", error);
    res.status(500).json({ error: "Error al obtener ingresos por mes" });
  }
};

export const getIngresosPorMetodoPagoController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ingresos = await estadisticasFinancierasService.getIngresosPorMetodoPago(fechaInicio, fechaFin);
    res.json(ingresos);
  } catch (error) {
    console.error("Error en getIngresosPorMetodoPagoController:", error);
    res.status(500).json({ error: "Error al obtener ingresos por método de pago" });
  }
};

// Controladores para ventas por sede
export const getVentasPorSedeController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ventas = await estadisticasFinancierasService.getVentasPorSede(fechaInicio, fechaFin);
    res.json(ventas);
  } catch (error) {
    console.error("Error en getVentasPorSedeController:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede" });
  }
};

export const getVentasPorSedePorMesController = async (req, res) => {
  try {
    const { anio } = req.query;
    const ventas = await estadisticasFinancierasService.getVentasPorSedePorMes(anio);
    res.json(ventas);
  } catch (error) {
    console.error("Error en getVentasPorSedePorMesController:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede y mes" });
  }
};

export const getVentasPorSedePorDiaController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const ventas = await estadisticasFinancierasService.getVentasPorSedePorDia(fechaInicio, fechaFin);
    res.json(ventas);
  } catch (error) {
    console.error("Error en getVentasPorSedePorDiaController:", error);
    res.status(500).json({ error: "Error al obtener ventas por sede y día" });
  }
};

// Controladores para clientes
export const getClientesConPagosPendientesController = async (req, res) => {
  try {
    const clientes = await estadisticasFinancierasService.getClientesConPagosPendientes();
    res.json(clientes);
  } catch (error) {
    console.error("Error en getClientesConPagosPendientesController:", error);
    res.status(500).json({ error: "Error al obtener clientes con pagos pendientes" });
  }
};

export const getTopClientesPorMontoController = async (req, res) => {
  try {
    const { limite } = req.query;
    const clientes = await estadisticasFinancierasService.getTopClientesPorMonto(limite);
    res.json(clientes);
  } catch (error) {
    console.error("Error en getTopClientesPorMontoController:", error);
    res.status(500).json({ error: "Error al obtener top clientes por monto" });
  }
};

// Controladores para proveedores
export const getPagosProveedoresTotalesController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const pagos = await estadisticasFinancierasService.getPagosProveedoresTotales(fechaInicio, fechaFin);
    res.json(pagos);
  } catch (error) {
    console.error("Error en getPagosProveedoresTotalesController:", error);
    res.status(500).json({ error: "Error al obtener pagos a proveedores" });
  }
};

export const getPagosProveedoresPorMesController = async (req, res) => {
  try {
    const { anio } = req.query;
    const pagos = await estadisticasFinancierasService.getPagosProveedoresPorMes(anio);
    res.json(pagos);
  } catch (error) {
    console.error("Error en getPagosProveedoresPorMesController:", error);
    res.status(500).json({ error: "Error al obtener pagos a proveedores por mes" });
  }
};

// Controlador para nómina
export const getNominaPorSedeYRolController = async (req, res) => {
  try {
    const { fechaInicio, fechaFin } = req.query;
    const nomina = await estadisticasFinancierasService.getNominaPorSedeYRol(fechaInicio, fechaFin);
    res.json(nomina);
  } catch (error) {
    console.error("Error en getNominaPorSedeYRolController:", error);
    res.status(500).json({ error: "Error al obtener datos de nómina" });
  }
};
