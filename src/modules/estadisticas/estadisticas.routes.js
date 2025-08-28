import { Router } from "express";
import {
  getTopProductosPorCantidadController,
  getTopProductosPorValorController,
  getProductosFrecuentesController,
  getStockVsVentasController,
  getProductosObsoletosController,
  getTopClientesPorMontoController,
  getTopClientesPorCantidadController,
  getTopClientesPorFrecuenciaController,
  getClientesFrecuentesVsEsporadicosController,
  getIngresosTotalesController,
  getIngresosPorDiaController,
  getIngresosPorMesController,
  getIngresosPorMetodoPagoController,
  getVentasPorSedeController,
  getVentasPorSedePorMesController,
  getVentasPorSedePorDiaController,
  getClientesConPagosPendientesController,
  getPagosProveedoresTotalesController,
  getPagosProveedoresPorMesController,
  getNominaPorSedeYRolController
} from "./estadisticas.controllers.js";

const router = Router();

// Rutas para estadísticas de productos
router.get("/productos/top-por-cantidad", getTopProductosPorCantidadController);
router.get("/productos/top-por-valor", getTopProductosPorValorController);
router.get("/productos/frecuentes", getProductosFrecuentesController);
router.get("/productos/stock-vs-ventas", getStockVsVentasController);
router.get("/productos/obsoletos", getProductosObsoletosController);

// Rutas para estadísticas de clientes
router.get("/clientes/top-por-cantidad", getTopClientesPorCantidadController);
router.get("/clientes/top-por-frecuencia", getTopClientesPorFrecuenciaController);
router.get("/clientes/frecuentes-vs-esporadicos", getClientesFrecuentesVsEsporadicosController);

// Rutas para ingresos
router.get("/ingresos/totales", getIngresosTotalesController);
router.get("/ingresos/por-dia", getIngresosPorDiaController);
router.get("/ingresos/por-mes", getIngresosPorMesController);
router.get("/ingresos/por-metodo-pago", getIngresosPorMetodoPagoController);

// Rutas para ventas por sede
router.get("/ventas/por-sede", getVentasPorSedeController);
router.get("/ventas/por-sede/por-mes", getVentasPorSedePorMesController);
router.get("/ventas/por-sede/por-dia", getVentasPorSedePorDiaController);

// Rutas para clientes
router.get("/clientes/con-pagos-pendientes", getClientesConPagosPendientesController);
router.get("/clientes/top-por-monto", getTopClientesPorMontoController);

// Rutas para proveedores
router.get("/proveedores/pagos-totales", getPagosProveedoresTotalesController);
router.get("/proveedores/pagos-por-mes", getPagosProveedoresPorMesController);

// Ruta para nómina
router.get("/nomina/por-sede-y-rol", getNominaPorSedeYRolController);

export default router;
