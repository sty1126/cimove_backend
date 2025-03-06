import { Router } from "express";
import { pool } from "../db.js";
import {
  createProducto,
  getProducto,
  getProductos,
  putProducto,
} from "../controllers/productos.controllers.js";

const router = Router();

router.get("/productos", getProductos); // Pedir todos los productos
router.get("/productos/:productoId", getProducto); // Pedir un producto
router.post("/productos", createProducto); // Crear un producto
router.put("/productos/:productoId", putProducto); // Actualizar un producto

export default router;
