import { Router } from "express";
import * as controller from "./estadisticas.controllers.js";

const router = Router();

// Productos
router.get("/productos/top-cantidad", controller.getTopProductosPorCantidadController);
router.get("/productos/top-valor", controller.getTopProductosPorValorController);
router.get("/productos/frecuentes", controller.getProductosMasFrecuentesController);
router.get("/productos/stock-vs-ventas", controller.getStockVsVentasController);
router.get("/productos/bajo-stock", controller.getProductosBajoStockAltaDemandaController);
router.get("/productos/obsoletos", controller.getProductosObsoletosController);

// Clientes
router.get("/clientes/top-monto", controller.getTopClientesPorMontoController);
router.get("/clientes/top-cantidad", controller.getTopClientesPorCantidadController);
router.get("/clientes/frecuencia", controller.getTopClientesPorFrecuenciaController);
router.get("/clientes/frecuentes-vs-esporadicos", controller.getClientesFrecuentesVsEsporadicosController);
router.get("/clientes/con-pagos-pendientes", controller.getClientesConPagosPendientesController);

// Ingresos
router.get("/ingresos/dia", controller.getIngresosPorDiaController);
router.get("/ingresos/mes", controller.getIngresosPorMesController);
router.get("/ingresos/anio", controller.getIngresosPorAnioController);
router.get("/ingresos/total-facturado", controller.getTotalFacturadoController);
router.get("/ingresos/total-pagado", controller.getTotalPagadoController);
router.get("/ingresos/metodo-pago", controller.getIngresosPorMetodoPagoController);
router.get("/ingresos/facturado-vs-recibido", controller.getComparacionFacturadoRecibidoController);

// Ventas por sede
router.get("/ventas/sede", controller.getVentasPorSedeController);
router.get("/ventas/sede/anio", controller.getVentasPorSedePorAnioController);
router.get("/ventas/sede/mes", controller.getVentasPorSedePorMesController);
router.get("/ventas/sede/dia", controller.getVentasPorSedePorDiaController);

// Pagos a proveedores
router.get("/pagos/proveedores/total", controller.getPagosProveedoresTotalesController);
router.get("/pagos/proveedores/por-proveedor", controller.getPagosPorProveedorController);
router.get("/pagos/proveedores/mes", controller.getPagosProveedoresPorMesController);

// Nómina
router.get("/nomina/sede-rol", controller.getNominaPorSedeYRolController);

export default router;
