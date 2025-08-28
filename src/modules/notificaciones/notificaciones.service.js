import * as repo from "./notificaciones.repository.js";

// Listar todas las notificaciones activas o filtradas
export async function getNotificaciones(req, res) {
  try {
    const query = {
      estado: req.query.estado,
      urgencia: req.query.urgencia,
      fecha: req.query.fecha,
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    };
    const data = await repo.fetchNotificaciones(query);
    res.json(data);
  } catch (error) {
    console.error("Error al obtener notificaciones:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Obtener notificación por ID
export async function getNotificacionById(req, res) {
  try {
    const { id } = req.params;
    const noti = await repo.fetchNotificacionById(id);
    if (!noti)
      return res.status(404).json({ error: "Notificación no encontrada" });
    res.json(noti);
  } catch (error) {
    console.error("Error al obtener notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Crear nueva notificación
export async function createNotificacion(req, res) {
  try {
    const nueva = await repo.insertNotificacion(req.body);
    res.status(201).json({
      message: "Notificación creada con éxito",
      notificacion: nueva,
    });
  } catch (error) {
    console.error("Error al crear notificación:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

// Actualizar notificación
export async function updateNotificacion(req, res) {
  try {
    const { id } = req.params;
    const actualizada = await repo.updateNotificacion(id, req.body);
    if (!actualizada)
      return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({
      message: "Notificación actualizada con éxito",
      notificacion: actualizada,
    });
  } catch (error) {
    console.error("Error al actualizar notificación:", error);
    res
      .status(error.status || 500)
      .json({ error: error.message || "Error interno del servidor" });
  }
}

// Inactivar notificación
export async function inactivarNotificacion(req, res) {
  try {
    const { id } = req.params;
    const inactiva = await repo.inactivarNotificacion(id);
    if (!inactiva)
      return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({
      message: "Notificación inactivada con éxito",
      notificacion: inactiva,
    });
  } catch (error) {
    console.error("Error al inactivar notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Marcar notificación como completada
export async function marcarNotificacionCompletada(req, res) {
  try {
    const { id } = req.params;
    // Cambiado de marcarNotificacionCompletada a completarNotificacion
    const actualizada = await repo.completarNotificacion(id);
    if (!actualizada)
      return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({
      message: "Notificación marcada como completada",
      notificacion: actualizada,
    });
  } catch (error) {
    console.error("Error al completar notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

// Restaurar notificación pendiente
export async function restaurarNotificacionPendiente(req, res) {
  try {
    const { id } = req.params;
    const actualizada = await repo.restaurarNotificacion(id);
    if (!actualizada)
      return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({
      message: "Notificación restaurada a pendiente",
      notificacion: actualizada,
    });
  } catch (error) {
    console.error("Error al restaurar notificación:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
