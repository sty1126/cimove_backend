import { Router } from "express";
import {
  getProveedores,
  getProveedorById,
  getTiposProveedores,
  createTipoProveedor,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "./proveedores.controllers.js";

const router = Router();

router.get("/tipos", getTiposProveedores);
router.post("/tipos", createTipoProveedor);

router.get("/all", getProveedores);
router.get("/:id", getProveedorById);
router.post("/", createProveedor);
router.put("/:id", updateProveedor);
router.put("/eliminar/:id", deleteProveedor);

export default router;
