import { Router } from "express";
import {
  getRentabilidadController,
  getEvolucionRentabilidadController,
} from "./estadisticasGenerales.controllers.js";

const router = Router();

// Beneficio neto en un rango de fechas
router.get("/rentabilidad", getRentabilidadController);

// Evolución de la rentabilidad para gráficas
router.get("/rentabilidad-evolucion", getEvolucionRentabilidadController);

export default router;
