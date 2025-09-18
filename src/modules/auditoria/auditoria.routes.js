import { Router } from "express";
import { 
  getAuditoriasController, 
  registrarAuditoriaController 
} from "./auditoria.controller.js";

const router = Router();

// Obtener todas las auditorías o filtradas según los parámetros
router.get("/", getAuditoriasController);

// Filtros por usuario
router.get("/usuario/:idUsuario", getAuditoriasController);

// Filtros por tipo de movimiento
router.get("/tipomov/:idTipoMov", getAuditoriasController);

// Filtros por fechas
// Ejemplo: /auditorias/fechas?fechaInicio=2025-01-01&fechaFin=2025-09-01
router.get("/fechas", getAuditoriasController);

// Registrar nueva acción de auditoría
router.post("/", registrarAuditoriaController);

export default router;
