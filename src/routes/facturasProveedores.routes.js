import express from "express";
import {
  getFacturasProveedor,
  createFacturaProveedor,
  getProductosOrdenParaFactura,
  generarFacturaDesdeOrden,
  getFacturaProveedorById,
} from "../controllers/facturasProveedores.controllers.js";

const router = express.Router();

router.get("/", getFacturasProveedor);
router.post("/", createFacturaProveedor);
router.get("/facturas/orden/:id_ordencompra", getProductosOrdenParaFactura);
router.post("/generar-desde-orden", generarFacturaDesdeOrden); 
router.get("/:id", getFacturaProveedorById);


export default router;
