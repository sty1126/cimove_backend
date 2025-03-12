import { Router } from "express";
import {
  getSedes,
  createSede,
  deactivateSede,
} from "../controllers/sedes.controllers.js";

const router = Router();

// Ruta para obtener todas las sedes activas
router.get("/", getSedes);

// Ruta para agregar una nueva sede
router.post("/", createSede);

// Ruta para desactivar una sede
router.put("/:id_sede/desactivar", deactivateSede);

export default router;
