import { Router } from "express";
import {
  getCategorias,
  createCategoria,
} from "../controllers/categoria.controllers.js";

const router = Router();

// Ruta para obtener todas las categorías activas
router.get("/", getCategorias);

// Ruta para agregar una nueva categoría
router.post("/", createCategoria);

export default router;
