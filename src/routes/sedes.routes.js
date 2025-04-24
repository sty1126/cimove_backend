import { Router } from "express";
import {
  getSedes,
  createSede,
  deactivateSede,
  getSedeByNombre,
} from "../controllers/sedes.controllers.js";

const router = Router();

// Ruta para obtener todas las sedes activas
router.get("/", getSedes);

// Ruta para agregar una nueva sede
router.post("/", createSede);

// Ruta para desactivar una sede
router.put("/:id_sede/desactivar", deactivateSede);

// Ruta para obtener la sede por nombre
router.get("/nombre/:nombre_sede", getSedeByNombre); // Nueva ruta

export default router;
