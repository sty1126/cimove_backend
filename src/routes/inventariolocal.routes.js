import { Router } from "express";
import {
  getInventarioLocal,
  getInventarioLocalBySede,
  createInventarioLocal,
  updateInventarioLocal,
  addStockToSede,
  existeEnInventarioLocal,
} from "../controllers/inventariolocal.controllers.js";

const router = Router();

// 📌 Obtener inventario
router.get("/", getInventarioLocal); // Obtener todo el inventario local
router.get("/sede/:sedeId", getInventarioLocalBySede); // Obtener inventario de una sede específica
router.get("/existe/:idProducto/:idSede", existeEnInventarioLocal); // Verificar si un producto está en el inventario de una sede

// 📌 Modificar inventario
router.post("/", createInventarioLocal); // Crear un nuevo registro de inventario local
router.put("/:inventariolocalId", updateInventarioLocal); // Actualizar un registro de inventario local
router.patch("/:idProducto/:idSede/ajustar", addStockToSede); // Añadir stock a una sede

export default router;
