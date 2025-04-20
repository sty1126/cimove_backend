import { Router } from "express";
import {
  agregarMetodosPago,
  obtenerMetodosPagoPorFactura,
  obtenerTodosLosMetodosPago,
  anularMetodoPago,
} from "../controllers/metodosPago.controllers.js";

const router = Router();

// POST - Agregar métodos de pago a una factura
router.post("/:idFactura", agregarMetodosPago);

// GET - Obtener todos los métodos de pago activos
router.get("/", obtenerTodosLosMetodosPago);

// GET - Obtener métodos de pago de una factura específica
router.get("/factura/:idFactura", obtenerMetodosPagoPorFactura);

// PUT - Anular un método de pago
router.put("/:idMetodoPago", anularMetodoPago);

export default router;
