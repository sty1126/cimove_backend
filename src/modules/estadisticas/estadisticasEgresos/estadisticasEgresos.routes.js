import { Router } from "express";
import {
  getEgresosPorPeriodoController,
  getPrincipalesEgresosController,
} from "./estadisticasEgresos.controllers.js";

const router = Router();

// Egresos totales por período
router.get("/egresos", getEgresosPorPeriodoController);

// Principales egresos por proveedor
router.get("/principales-egresos", getPrincipalesEgresosController);

export default router;
