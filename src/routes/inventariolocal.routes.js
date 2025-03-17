import { Router } from "express";
import {
  getInventarioLocal,
  getInventarioLocalBySede,
  createInventarioLocal,
  updateInventarioLocal,
  addStockToSede,
} from "../controllers/inventariolocal.controllers.js";

const router = Router();

router.get("/", getInventarioLocal); // Obtener todo el inventario local
router.get("/sede/:sedeId", getInventarioLocalBySede); // Obtener inventario por sede
router.post("/", createInventarioLocal); // Crear un nuevo registro de inventario local
router.put("/:inventariolocalId", updateInventarioLocal); // Actualizar un registro de inventario local
router.patch("/:inventariolocalId/ajustar", addStockToSede); // Ajustar existencia de un producto

export default router;
