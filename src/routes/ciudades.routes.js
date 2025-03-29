import { Router } from "express";
import { getCiudades, createCiudad } from "../controllers/ciudades.controllers.js";

const router = Router();

router.get("/ciudades", getCiudades);

export default router;
