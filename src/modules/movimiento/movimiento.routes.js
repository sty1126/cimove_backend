import { Router } from "express";
import {
  getMovimientos,
  getTipoMovimientos,
  createMovimiento
} from "./movimiento.controllers.js";

const router = Router();

router.get("/", getMovimientos);
router.get("/tipo", getTipoMovimientos);
router.post("/", createMovimiento);

export default router;
