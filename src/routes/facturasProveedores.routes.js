import express from "express";
import {
  getFacturasProveedor,
  createFacturaProveedor,
  getProductosOrdenParaFactura,
  generarFacturaDesdeOrden,
} from "../controllers/facturasProveedores.controllers.js";

const router = express.Router();

router.get("/", getFacturasProveedor);
router.post("/", createFacturaProveedor);
router.get("/facturas/orden/:id_ordencompra", getProductosOrdenParaFactura);
router.post("/facturas/generar-desde-orden", generarFacturaDesdeOrden);

export default router;
