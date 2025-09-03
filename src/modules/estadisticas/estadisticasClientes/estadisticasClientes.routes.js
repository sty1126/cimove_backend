import { Router } from "express";
import {
  getClientesActivosPorPeriodoController,
  getMejoresClientesController,
  getClientesPorSedeController,
} from "./estadisticasClientes.controllers.js";

const router = Router();

// Cantidad de clientes activos por período
router.get("/clientes-activos", getClientesActivosPorPeriodoController);

// Mejores clientes por volumen de compra
router.get("/mejores-clientes", getMejoresClientesController);

// Clientes agrupados por sede
router.get("/clientes-por-sede", getClientesPorSedeController);

export default router;
