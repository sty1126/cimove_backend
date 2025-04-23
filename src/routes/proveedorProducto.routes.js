import express from "express";
import {
  getProveedoresByProducto,
  asociarProveedorAProducto,
  getProveedoresByMultipleProductos,
  desasociarProveedorDeProducto,
} from "../controllers/proveedorProducto.controllers.js";

const router = express.Router();

// 🔍 Ej: /api/proveedorproducto?ids=1,2,3
router.get("/", getProveedoresByMultipleProductos);

// 🔍 Ej: /api/proveedorproducto/5
router.get("/:id_producto", getProveedoresByProducto);

// ➕ Asociar proveedor a producto
router.post("/", asociarProveedorAProducto);

// ❌ Quitar la relación
router.put("/:id_proveedorproducto", desasociarProveedorDeProducto);

export default router;
