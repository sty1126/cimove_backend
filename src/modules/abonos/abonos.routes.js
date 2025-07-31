import { Router } from "express";
import {
  getAbonosController,
  createAbonoController,
  getAbonosPorFacturaController,
  anularAbonoController,
  getTotalAbonadoPorFacturaController,
} from "./abonos.controllers";

const router = Router();

router.get("/", getAbonosController);
router.post("/", createAbonoController);
router.get("/factura/:idFactura", getAbonosPorFacturaController) ;
router.delete("/:id", anularAbonoController);
router.get("/total/:idFactura", getTotalAbonadoPorFacturaController);

export default router;
