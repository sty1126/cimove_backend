import { Router } from "express";
import {
  getTipoMovimientos,
  getMovimientos,
  createMovimiento,
} from "../controllers/movimiento.controller.js";

const router = Router();

// Ruta para obtener todos los movimientos de productos
router.get("/", getMovimientos);
router.get("/tipo", getTipoMovimientos);
// Ruta para agregar un nuevo movimiento de producto
router.post("/", createMovimiento);

export default router;
