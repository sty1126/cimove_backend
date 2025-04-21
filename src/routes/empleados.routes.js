import express from "express";
import {
  getEmpleadosConUsuario,
  crearEmpleado,
  eliminarEmpleado,
  getEmpleadoPorId,
  actualizarEmpleado,
} from "../controllers/empleados.controllers.js";

const router = express.Router();

router.get("/", getEmpleadosConUsuario);
router.post("/", crearEmpleado);
router.get("/:id", getEmpleadoPorId);
router.put("/eliminar/:id", eliminarEmpleado);
router.put("/:id", actualizarEmpleado);

export default router;
