import { Router } from "express";
import {
  getProductos,
  getProducto,
  getProductosDetalles,
  getProductoDetalle,
  createProducto,
  putProducto,
  deleteProducto,
  getProveedoresPorProducto,
} from "./productos.controllers.js";

const router = Router();

router.get("/", getProductos);
router.get("/detalle/:productoId", getProductoDetalle);
router.get("/detalles", getProductosDetalles);
router.get("/:productoId", getProducto);
router.post("/", createProducto);
router.put("/:productoId", putProducto);
router.put("/eliminar/:id", deleteProducto);
router.get("/:productoId/proveedores", getProveedoresPorProducto);

export default router;
