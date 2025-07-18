import { Router } from "express";
import {
  getCiudadesController,
  createCiudadController,
} from "./ciudades.controllers.js";

const router = Router();

router.get("/", getCiudadesController);

router.post("/", createCiudadController);

export default router;
