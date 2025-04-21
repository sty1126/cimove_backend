import { Router } from "express";
import { getTiposUsuario } from "../controllers/tiposUsuario.controllers.js";

const router = Router();

router.get("/", getTiposUsuario);

export default router;
