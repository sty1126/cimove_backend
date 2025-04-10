import express from "express";
import {
  getFacturasProveedor,
  createFacturaProveedor,
} from "../controllers/facturasProveedores.controllers.js";

const router = express.Router();

router.get("/", getFacturasProveedor);
router.post("/", createFacturaProveedor);

export default router;
