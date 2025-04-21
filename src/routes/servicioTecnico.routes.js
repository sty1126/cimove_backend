import { Router } from "express";
import {
  createServicioTecnico,
  updateServicioTecnico,
  changeEstadoServicioTecnico,
  getServiciosTecnicos,
} from "../controllers/servicioTecnico.controllers.js";

const router = Router();

router.post("/", createServicioTecnico);
router.put("/:id", updateServicioTecnico);
router.put("/:id/estado", changeEstadoServicioTecnico);
router.get("/", getServiciosTecnicos);

export default router;
