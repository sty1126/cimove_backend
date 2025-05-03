import express from "express";
import {
  getTopProductosPorCantidad,
  getTopProductosPorValor,
  getProductosMasFrecuentes,
  getStockVsVentas,
  getProductosBajoStockAltaDemanda,
  getProductosObsoletos,
  getTopClientesPorMonto,
  getTopClientesPorCantidad,
  getTopClientesPorFrecuencia,
  getClientesFrecuentesVsEsporadicos,
  getClientesConPagosPendientes,
  getIngresosPorDia,
  getIngresosPorMes,
  getIngresosPorAnio,
  getTotalFacturado,
  getTotalPagado,
  getIngresosPorMetodoPago,
  getVentasPorSede,
  getPagosProveedoresTotales,
  getPagosPorProveedor,
  getPagosProveedoresPorMes,
  getNominaPorSedeYRol,
  getVentasPorSedePorAnio,
  getVentasPorSedePorMes,
  getVentasPorSedePorDia,
} from "../controllers/estadisticas.controllers.js"; // Asegúrate de tener el controlador correcto

const router = express.Router();

// Productos
router.get("/top-productos/cantidad", getTopProductosPorCantidad);
router.get("/top-productos/valor", getTopProductosPorValor);
router.get("/productos-frecuentes", getProductosMasFrecuentes);
router.get("/stock-vs-ventas", getStockVsVentas);
router.get(
  "/productos-bajo-stock-alta-demanda",
  getProductosBajoStockAltaDemanda
);
router.get("/productos-obsoletos", getProductosObsoletos);

// Clientes
router.get("/top-clientes/monto", getTopClientesPorMonto);
router.get("/top-clientes/cantidad", getTopClientesPorCantidad);
router.get("/top-clientes/frecuencia", getTopClientesPorFrecuencia);
router.get(
  "/clientes-frecuentes-vs-esporadicos",
  getClientesFrecuentesVsEsporadicos
);
router.get("/clientes-pagos-pendientes", getClientesConPagosPendientes);

// Ingresos
router.get("/ingresos/dia", getIngresosPorDia);
router.get("/ingresos/mes", getIngresosPorMes);
router.get("/ingresos/ano", getIngresosPorAnio);
router.get("/ingresos/total", getTotalFacturado);
router.get("/ingresos/reales", getTotalPagado);
router.get("/ingresos/metodo-pago", getIngresosPorMetodoPago);
router.get("/ingresos/sede", getVentasPorSede);
router.get("/ingresos/sedeanio", getVentasPorSedePorAnio);
router.get("/ingresos/sedemes", getVentasPorSedePorMes);
router.get("/ingresos/sededia", getVentasPorSedePorDia);

// Proveedores
router.get("/pagos-proveedores/totales", getPagosProveedoresTotales);
router.get("/pagos-proveedores/por-proveedor", getPagosPorProveedor);
router.get("/pagos-proveedores/por-mes", getPagosProveedoresPorMes);
router.get("/nomina/por-sede-rol", getNominaPorSedeYRol);

export default router;
