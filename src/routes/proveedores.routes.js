import { Router } from "express";
import {
  getProveedores,
  getProveedorById,
  getTiposProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
  createTipoProveedor,
} from "../controllers/proveedores.controllers.js";

const router = Router();

router.get("/tipos", getTiposProveedores);

router.get("/all", getProveedores);
router.get("/:id", getProveedorById);
router.post("/", createProveedor);
router.put("/:id", updateProveedor);
router.put("/eliminar/:id", deleteProveedor);
router.get("/proveedores/tipos", getTiposProveedores);
router.post("/proveedores/tipos", createTipoProveedor);

export default router;
