import { Router } from "express";
import {
  createProducto,
  getProducto,
  getProductos,
  getProductosDetalles,
  putProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/", getProductos); // Obtener todos los productos
router.get("/detalles", getProductosDetalles); // Obtener detalles completos de productos (SIN PARAMETROS)
router.get("/:productoId", getProducto); // Obtener un producto por ID
router.post("/", createProducto); // Crear un producto
router.put("/:productoId", putProducto); // Actualizar un producto

export default router;
