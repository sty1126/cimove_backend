import express from "express";
import {
  getEmpleadosConUsuario,
  crearEmpleado,
  eliminarEmpleado,
  getEmpleadoPorId,
  actualizarEmpleado,
  restaurarEmpleado,
} from "../controllers/empleados.controllers.js";

const router = express.Router();

router.get("/", getEmpleadosConUsuario);
router.post("/", crearEmpleado);
router.get("/:id", getEmpleadoPorId);
router.put("/eliminar/:id", eliminarEmpleado);
router.put("/restaurar/:id", restaurarEmpleado);
router.put("/:id", actualizarEmpleado);

export default router;
