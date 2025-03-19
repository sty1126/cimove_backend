import { pool } from "../db.js";
import { Router } from "express";
import {
  createProducto,
  getProducto,
  getProductos,
  getProductosDetalles,
  getProductoDetalle,
  putProducto,
  deleteProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", getProductos); // Obtener todos los productos
router.get("/detalles", getProductosDetalles); // Obtener detalles completos de productos
router.get("/detalle/:productoId", getProductoDetalle);
router.get("/:productoId", getProducto); // Obtener un producto por ID
router.post("/", createProducto); // Crear un producto
router.put("/:productoId", putProducto); // Actualizar un producto
router.put("/eliminar/:id", deleteProducto); // Eliminar un proveedor

export default router;
