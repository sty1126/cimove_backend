import { Router } from "express";
import * as controller from "./tiposMetodoPago.controllers.js";

const router = Router();

router.get("/", controller.getTiposMetodoPagoController);
router.post("/", controller.crearTipoMetodoPagoController);
router.put("/:id", controller.actualizarTipoMetodoPagoController);
router.put("/eliminar/:id", controller.eliminarTipoMetodoPagoController);

export default router;
