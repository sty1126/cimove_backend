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

router.get("/", getInventarioLocal); // Obtener todo el inventario local
router.get("/sede/:sedeId", getInventarioLocalBySede); // Obtener inventario por sede
router.get("/existe/:idProducto/:idSede", existeEnInventarioLocal);
router.post("/", createInventarioLocal); // Crear un nuevo registro de inventario local
router.put("/:inventariolocalId", updateInventarioLocal); // Actualizar un registro de inventario local
router.patch("/:idProducto/:idSede/ajustar", addStockToSede);

export default router;
