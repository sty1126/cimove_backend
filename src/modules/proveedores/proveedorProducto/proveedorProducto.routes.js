import express from "express";
import {
  getProveedoresByProducto,
  asociarProveedorAProducto,
  getProveedoresByMultipleProductos,
  desasociarProveedorDeProducto,
} from "./proveedorProducto.controllers.js";

const router = express.Router();

router.get("/", getProveedoresByMultipleProductos);
router.get("/:id_producto", getProveedoresByProducto);
router.post("/", asociarProveedorAProducto);
router.put("/:id_proveedorproducto", desasociarProveedorDeProducto);

export default router;
