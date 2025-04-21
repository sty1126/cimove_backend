import { Router } from "express";
import {
  createFactura,
  getFacturas,
} from "../controllers/factura.controllers.js";

const router = Router();

router.post("/", createFactura);
router.get("/", getFacturas);

export default router;
