import { Router } from "express";
import {
  getNotificaciones,
  getNotificacionById,
  createNotificacion,
  updateNotificacion,
  inactivarNotificacion,
  getNotificacionesCompletadas,
  marcarNotificacionCompletada,
  restaurarNotificacionPendiente,
} from "./notificaciones.controllers.js";

const router = Router();

// 2. Notificaciones completadas / estado
router.get("/completadas", getNotificacionesCompletadas); // Obtener completadas
router.put("/:id/completar", marcarNotificacionCompletada); // Marcar como completada
router.put("/:id/restaurar", restaurarNotificacionPendiente); // Restaurar pendiente

// 1. Notificaciones generales
router.get("/", getNotificaciones); // Obtener todas activas o filtradas por query params
router.get("/:id", getNotificacionById); // Obtener por ID
router.post("/", createNotificacion); // Crear
router.put("/:id", updateNotificacion); // Actualizar
router.put("/:id/inactivar", inactivarNotificacion); // Inactivar

// NOTA: Las siguientes funciones se manejan con query params directamente en la ruta principal `/notificaciones`
// Ejemplos:
// - /notificaciones?estado=P
// - /notificaciones?urgencia=U
// - /notificaciones?fecha=<hoy>
// - /notificaciones?fechaInicio=2025-08-01&fechaFin=2025-08-20

export default router;
