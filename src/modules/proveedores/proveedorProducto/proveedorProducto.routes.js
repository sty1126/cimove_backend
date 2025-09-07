import express from "express";
import {
  getProveedoresByProducto,
  getProductosByProveedor,
  asociarProveedorAProducto,
  getProveedoresByMultipleProductos,
  desasociarProveedorDeProducto,
} from "./proveedorProducto.controllers.js";

const router = express.Router();

router.get("/", getProveedoresByMultipleProductos);
router.get("/proveedor/:id/productos", getProductosByProveedor);
router.get("/:id/producto", getProveedoresByProducto);
router.post("/", asociarProveedorAProducto);
router.put("/:id_proveedorproducto", desasociarProveedorDeProducto);


export default router;
