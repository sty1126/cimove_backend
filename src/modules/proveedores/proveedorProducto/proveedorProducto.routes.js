import express from "express";
import {
  getProveedoresByProducto,
  getProductosByProveedor,
  asociarProveedorAProducto,
  getProveedoresByMultipleProductos,
  desasociarProveedorDeProducto,
  eliminarAsociacion, // Nueva ruta
} from "./proveedorProducto.controllers.js";

const router = express.Router();

router.get("/", getProveedoresByMultipleProductos);
router.get("/proveedor/:id/productos", getProductosByProveedor);
router.get("/:id_producto/producto", getProveedoresByProducto);
router.post("/", asociarProveedorAProducto);
router.put("/:id_proveedorproducto", desasociarProveedorDeProducto);
router.put("/inactivar", eliminarAsociacion);

export default router;


