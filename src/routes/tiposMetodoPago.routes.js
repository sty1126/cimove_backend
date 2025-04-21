import { Router } from "express";
import {
  getTiposMetodoPago,
  crearTipoMetodoPago,
  actualizarTipoMetodoPago,
  eliminarTipoMetodoPago,
} from "../controllers/tiposMetodoPago.controllers.js";

const router = Router();

router.get("/", getTiposMetodoPago);
router.post("/", crearTipoMetodoPago);
router.put("/:id", actualizarTipoMetodoPago);
router.put("/eliminar/:id", eliminarTipoMetodoPago);

export default router;
