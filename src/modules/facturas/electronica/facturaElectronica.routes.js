import { Router } from "express";
import {
  getFacturasElectronicas,
  getFacturaElectronicaById,
  createFacturaElectronica,
  updateFacturaElectronica,
  deleteFacturaElectronica,
} from "./facturaElectronica.controllers.js";

const router = Router();

router.get("/", getFacturasElectronicas);
router.get("/:id", getFacturaElectronicaById);
router.post("/", createFacturaElectronica);
router.put("/actualizar/:id", updateFacturaElectronica);
router.put("/:id", deleteFacturaElectronica);

export default router;
