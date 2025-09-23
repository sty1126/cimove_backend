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

import { enviarCorreoNotificacion } from "../../utils/mailer.js";

const router = Router();

router.get("/completadas", getNotificacionesCompletadas); // Obtener completadas
router.put("/:id/completar", marcarNotificacionCompletada); // Marcar como completada
router.put("/:id/restaurar", restaurarNotificacionPendiente); // Restaurar pendiente

router.get("/", getNotificaciones); // Obtener todas activas o filtradas por query params
router.get("/:id", getNotificacionById); // Obtener por ID
router.post("/", createNotificacion); // Crear
router.put("/:id", updateNotificacion); // Actualizar
router.put("/:id/inactivar", inactivarNotificacion); // Inactivar

router.get("/test-email", async (req, res) => {
  try {
    const testNotificacion = {
      titulo: "Notificación de prueba",
      mensaje: "Este es un mensaje de prueba del sistema",
      fecha_creacion: new Date(),
    };

    const result = await enviarCorreoNotificacion(testNotificacion);

    res.json({
      success: true,
      message: "Correo de prueba enviado",
      messageId: result.messageId,
    });
  } catch (error) {
    console.error("Error en test email:", error);
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

export default router;
