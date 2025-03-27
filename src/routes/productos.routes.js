import { pool } from "../db.js";
import { Router } from "express";
import {
  createProducto,
  getProducto,
  getProductos,
  getProductoDetalle,
  getProductosDetalles,
  putProducto,
  deleteProducto,
  getProveedoresPorProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", getProductos); // Obtener todos los productos
router.get("/detalle/:productoId", getProductoDetalle);
router.get("/detalles", getProductosDetalles);
router.get("/:productoId", getProducto); // Obtener un producto por ID
router.post("/", createProducto); // Crear un producto
router.put("/:productoId", putProducto); // Actualizar un producto
router.put("/eliminar/:id", deleteProducto); // Eliminar un proveedor
router.get("/:productoId/proveedores", getProveedoresPorProducto);

export default router;
