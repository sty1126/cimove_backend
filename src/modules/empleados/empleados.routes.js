import { Router } from "express";
import * as controller from "./empleados.controllers.js";

const router = Router();

router.get("/", controller.getEmpleadosConUsuarioController);
router.post("/", controller.crearEmpleadoController);
router.get("/:id", controller.getEmpleadoPorIdController);
router.put("/eliminar/:id", controller.eliminarEmpleadoController);
router.put("/restaurar/:id", controller.restaurarEmpleadoController);
router.put("/:id", controller.actualizarEmpleadoController);

export default router;
