
import { Router } from "express";
import {
  agregarMetodosPago,
  obtenerMetodosPagoPorFactura,
  obtenerTodosLosMetodosPago,
  anularMetodoPago,
} from "./metodosPago.controllers.js";

const router = Router();


router.post("/:idFactura", agregarMetodosPago);


router.get("/", obtenerTodosLosMetodosPago);


router.get("/factura/:idFactura", obtenerMetodosPagoPorFactura);


router.put("/:idMetodoPago", anularMetodoPago);

export default router;