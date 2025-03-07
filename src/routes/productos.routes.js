import { Router } from "express";
import { pool } from "../db.js";
import {
  createProducto,
  getProducto,
  getProductos,
  getProductosDetalles,
  putProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", getProductos); // Pedir todos los productos
router.get("/:productoId", getProducto); // Pedir un producto
router.get("/detalles", getProductosDetalles); // Pedir detalles completos de los productos
router.post("/", createProducto); // Crear un producto
router.put("/:productoId", putProducto); // Actualizar un producto

export default router;
