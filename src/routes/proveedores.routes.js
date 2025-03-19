import { Router } from "express";
import {
  getProveedores,
  getProveedorById,
  getTiposProveedores,
  createProveedor,
  updateProveedor,
  deleteProveedor,
} from "../controllers/proveedores.controllers.js";

const router = Router();

// Rutas de tipos de proveedores
router.get("/tipos", getTiposProveedores); // Obtener todos los tipos de proveedores

// Rutas de proveedores
router.get("/all", getProveedores); // Obtener todos los proveedores
router.get("/:id", getProveedorById); // Obtener un proveedor por ID
router.post("/", createProveedor); // Crear un nuevo proveedor
router.put("/:id", updateProveedor); // Actualizar un proveedor
router.put("/eliminar/:id", deleteProveedor); // Eliminar un proveedor

export default router;
