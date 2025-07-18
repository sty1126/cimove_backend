import { Router } from "express";
import * as controller from "./clientes.controllers.js";

const router = Router();

router.get("/", controller.getClientesController);
router.get("/formateados", controller.getClientesFormateadosController);
router.get("/:id", controller.getClienteByIdController);
router.get("/naturales", controller.getClientesNaturalesController);
router.get("/juridicos", controller.getClientesJuridicosController);
router.get("/tipos-cliente", controller.getTiposClienteController);
router.put("/:id", controller.updateClienteController);
router.post("/", controller.crearClienteController);
router.put("/eliminar/:id", controller.eliminarClienteController);
router.get("/sede/:idSede", controller.getClientesPorSedeController);

export default router;
