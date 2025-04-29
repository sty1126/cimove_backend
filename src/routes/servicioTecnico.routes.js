import { Router } from "express";
import {
  createServicioTecnico,
  getServiciosTecnicos,
  updateServicioTecnico,
  getServicioTecnicoById,
} from "../controllers/servicioTecnico.controllers.js";

const router = Router();

router.post("/", createServicioTecnico);
router.get("/", getServiciosTecnicos);
router.get("/:id", getServicioTecnicoById);
router.put("/:id", updateServicioTecnico);

export default router;
