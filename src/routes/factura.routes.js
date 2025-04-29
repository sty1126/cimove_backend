import { Router } from "express";
import {
  createFactura,
  getFacturas,
  getFacturaById, // importamos la nueva función
} from "../controllers/factura.controllers.js";

const router = Router();

// Crear una factura
router.post("/", createFactura);

// Listar todas las facturas
router.get("/", getFacturas);

// Obtener una factura por su ID
router.get("/:idFactura", getFacturaById);

export default router;
