import { Router } from "express";
import {
  getAbonos,
  createAbono,
  getAbonosPorFactura,
  anularAbono,
  getTotalAbonadoPorFactura,
} from "../controllers/abonos.controllers.js";

const router = Router();

router.get("/", getAbonos);
router.post("/", createAbono);
router.get("/factura/:idFactura", getAbonosPorFactura);
router.delete("/:id", anularAbono);
router.get("/total/:idFactura", getTotalAbonadoPorFactura);

export default router;
