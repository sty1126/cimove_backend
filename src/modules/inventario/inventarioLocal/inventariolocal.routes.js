import { Router } from "express";
import {
  getInventarioLocal,
  getInventarioLocalBySede,
  createInventarioLocal,
  updateInventarioLocal,
  addStockToSede,
  existeEnInventarioLocal
} from "./inventariolocal.controllers.js";

const router = Router();

router.get("/", getInventarioLocal);
router.get("/sede/:sedeId", getInventarioLocalBySede);
router.get("/existe/:idProducto/:idSede", existeEnInventarioLocal);
router.post("/", createInventarioLocal);
router.put("/:inventarioLocalId", updateInventarioLocal);
router.patch("/:idProducto/:idSede/ajustar", addStockToSede);

export default router;
