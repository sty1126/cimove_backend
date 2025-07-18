import { Router } from "express";
import {
  getFacturasProveedor,
  getFacturaProveedorById,
  createFacturaProveedor,
} from "./facturasProveedores.controllers.js";

const router = Router();

router.get("/", getFacturasProveedor);
router.get("/:id", getFacturaProveedorById);
router.post("/", createFacturaProveedor);

export default router;
