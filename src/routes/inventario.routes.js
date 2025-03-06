import { Router } from "express";
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario,
} from "../controllers/inventario.controllers.js";

const router = Router();

router.get("/inventario", getInventario); // Obtener todo el inventario
router.get("/inventario/:inventarioId", getInventarioById); // Obtener un registro de inventario
router.post("/inventario", createInventario); // Crear un nuevo registro de inventario
router.put("/inventario/:inventarioId", updateInventario); // Actualizar un registro de inventario

export default router;
