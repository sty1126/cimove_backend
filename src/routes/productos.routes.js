import { pool } from "../db.js";
import { Router } from "express";
import {
  createProducto,
  getProducto,
  getProductos,
  getProductosDetalles,
  getProductoDetalle,
  putProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", getProductos); // Obtener todos los productos
router.get("/detalles", getProductosDetalles); // Obtener detalles completos de productos
router.get("/detalle/:productoId", getProductoDetalle);
router.get("/:productoId", getProducto); // Obtener un producto por ID
router.post("/", createProducto); // Crear un producto
router.put("/:productoId", putProducto); // Actualizar un producto

export default router;
