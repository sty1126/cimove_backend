import { Router } from "express";
import {
  getInventario,
  getInventarioById,
  createInventario,
  updateInventario
} from "./inventario.controllers.js";

const router = Router();

router.get("/", getInventario);
router.get("/:inventarioId", getInventarioById);
router.post("/", createInventario);
router.put("/:inventarioId", updateInventario);

export default router;
