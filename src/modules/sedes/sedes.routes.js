import { Router } from "express";
import {
  getSedes,
  createSede,
  deactivateSede,
  getSedeById,
  getSedeByNombre,
} from "./sedes.controllers.js";

const router = Router();

router.get("/", getSedes);
router.post("/", createSede);
router.put("/:id_sede/desactivar", deactivateSede);
router.get("/:id_sede", getSedeById);
router.get("/nombre/:nombre_sede", getSedeByNombre);

export default router;
