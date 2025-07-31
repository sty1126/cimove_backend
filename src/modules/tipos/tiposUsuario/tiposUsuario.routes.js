import { Router } from "express";
import { getTiposUsuario } from "./tiposUsuario.controllers.js";

const router = Router();

router.get("/", getTiposUsuario);

export default router;