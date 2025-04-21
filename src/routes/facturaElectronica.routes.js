import { Router } from "express";
import {
  getFacturasElectronicas,
  getFacturaElectronicaById,
  createFacturaElectronica,
  deleteFacturaElectronica,
  updateFacturaElectronica,
} from "../controllers/facturaElectronica.controllers.js";

const router = Router();

router.get("/", getFacturasElectronicas);
router.get("/:id", getFacturaElectronicaById);
router.post("/", createFacturaElectronica);
router.put("/:id", deleteFacturaElectronica);
router.put("/actualizar/:id", updateFacturaElectronica);

export default router;
