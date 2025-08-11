import { Router } from "express";
import * as controller from "./factura.controllers.js";

const router = Router();

// Crear una factura
router.post("/", controller.createFacturaController);

// Listar todas las facturas
router.get("/", controller.getFacturasController);

// Obtener una factura por su ID
router.get("/:idFactura", controller.getFacturaByIdController);

export default router;
