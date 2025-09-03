import { Router } from "express";
import {
  getVentasPorDiaSemanaController,
  getMapaCalorVentasController,
  getIngresosPorCategoriaController,
  getIngresosPorPeriodoController,
  getVentasPorSedeController,
  getIngresosPorMetodoPagoController,
  getIngresosPorMetodoPagoYSedeController,
} from "./estadisticasIngresos.controllers.js";

const router = Router();

// Ventas por día de la semana
router.get("/ventas-dia-semana", getVentasPorDiaSemanaController);

// Mapa de calor de ventas
router.get("/mapa-calor", getMapaCalorVentasController);

// Ingresos por categoría
router.get("/ingresos-categoria", getIngresosPorCategoriaController);

// Ingresos totales por período
router.get("/ingresos-periodo", getIngresosPorPeriodoController);

// Ventas por sede
router.get("/ventas-sede", getVentasPorSedeController);

// Ingresos por método de pago
router.get("/ingresos-metodo-pago", getIngresosPorMetodoPagoController);

// Ingresos por método de pago y sede
router.get("/ingresos-metodo-pago-sede", getIngresosPorMetodoPagoYSedeController);

export default router;
