import { Router } from "express";
import { getAuditoriasController } from "./auditoria.controller.js";

const router = Router();

// Obtener todas las auditorías o filtradas según los parámetros
router.get("/", getAuditoriasController);

// Filtros por usuario
router.get("/usuario/:idUsuario", getAuditoriasController);

// Filtros por tipo de movimiento
router.get("/tipomov/:idTipoMov", getAuditoriasController);

// Filtros por fechas
// Ejemplo: /fechas?fechaInicio=2025-01-01&fechaFin=2025-09-01
router.get("/fechas", getAuditoriasController);

export default router;
