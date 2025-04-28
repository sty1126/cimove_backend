import { Router } from "express";
import {
  createFacturaServicioTecnico,
  getFacturaServicioTecnico,
  actualizarDiagnostico,
  autorizarServicioTecnico,
  facturarServicioTecnico,
  addMetodoPago,
} from "../controllers/servicioTecnico.controllers.js";

const router = Router();

// Ruta para obtener todos los servicios técnicos
router.get("/", getFacturaServicioTecnico);

// Ruta para crear un nuevo servicio técnico
router.post("/", createFacturaServicioTecnico);

router.post("/metodopago", addMetodoPago);

// Ruta para actualizar el diagnóstico de un servicio técnico
router.put("/:id/diagnostico", actualizarDiagnostico);

// Ruta para autorizar un servicio técnico para continuar con la reparación
router.put("/:id/autorizar", autorizarServicioTecnico);

// Ruta para facturar un servicio técnico
router.put("/:id/facturar", facturarServicioTecnico);

export default router;
