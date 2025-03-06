import { Router } from "express";
import {
  getInventarioLocal,
  getInventarioLocalBySede,
  createInventarioLocal,
  updateInventarioLocal,
} from "../controllers/inventariolocal.controllers.js";

const router = Router();

router.get("/inventariolocal", getInventarioLocal); // Obtener todo el inventario local
router.get("/inventariolocal/sede/:sedeId", getInventarioLocalBySede); // Obtener inventario por sede
router.post("/inventariolocal", createInventarioLocal); // Crear un nuevo registro de inventario local
router.put("/inventariolocal/:inventariolocalId", updateInventarioLocal); // Actualizar un registro de inventario local

export default router;
