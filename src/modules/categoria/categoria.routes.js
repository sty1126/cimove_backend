import { Router } from "express";
import {
  getCategoriasController,
  createCategoriaController,
} from "./categoria.controllers.js";

const router = Router();

// Ruta para obtener todas las categorías activas
router.get("/", getCategoriasController);

// Ruta para agregar una nueva categoría
router.post("/", createCategoriaController);

export default router;
