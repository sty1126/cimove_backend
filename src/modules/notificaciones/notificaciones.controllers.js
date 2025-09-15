import * as repo from "./notificaciones.repository.js";
import { enviarCorreoNotificacion } from '../../utils/mailer.js';

// 1. Notificaciones generales
export const getNotificaciones = (req, res) =>
  repo
    .fetchNotificaciones(req.query)
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const getNotificacionById = (req, res) =>
  repo
    .fetchNotificacionById(req.params.id)
    .then((row) => res.json(row))
    .catch((err) => res.status(500).json({ error: err.message }));

export const createNotificacion = (req, res) =>
  repo
    .insertNotificacion(req.body)
    .then((row) => {
      
      enviarCorreoNotificacion(row)
        .then(() => console.log("Correo enviado con éxito."))
        .catch((err) => console.error("Error al enviar el correo:", err));

      res.json(row);
    })
    .catch((err) => res.status(500).json({ error: err.message }));
export const updateNotificacion = (req, res) =>
  repo
    .updateNotificacion(req.params.id, req.body)
    .then((row) => res.json(row))
    .catch((err) => res.status(500).json({ error: err.message }));

export const inactivarNotificacion = (req, res) =>
  repo
    .inactivarNotificacion(req.params.id)
    .then((row) => res.json(row))
    .catch((err) => res.status(500).json({ error: err.message }));

// 2. Notificaciones completadas / estado
export const getNotificacionesCompletadas = (req, res) =>
  repo
    .fetchNotificaciones({ estado: "C" }) // usando la función que ya existe
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const marcarNotificacionCompletada = (req, res) =>
  repo
    .completarNotificacion(req.params.id)
    .then((row) => res.json(row))
    .catch((err) => res.status(500).json({ error: err.message }));

export const restaurarNotificacionPendiente = (req, res) =>
  repo
    .restaurarNotificacion(req.params.id)
    .then((row) => res.json(row))
    .catch((err) => res.status(500).json({ error: err.message }));

// 3. Filtros
export const getNotificacionesPorEstado = (req, res) =>
  repo
    .fetchNotificaciones({ estado: req.query.estado })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const getNotificacionesPorUrgencia = (req, res) =>
  repo
    .fetchNotificaciones({ urgencia: req.query.urgencia })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const getNotificacionesPorFechas = (req, res) =>
  repo
    .fetchNotificaciones({
      fechaInicio: req.query.fechaInicio,
      fechaFin: req.query.fechaFin,
    })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const getNotificacionesHoy = (req, res) => {
  const hoy = new Date().toISOString().split("T")[0];
  repo
    .fetchNotificaciones({ fecha: hoy })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));
};

export const getNotificacionesPendientes = (req, res) =>
  repo
    .fetchNotificaciones({ estado: "P" })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));

export const getNotificacionesUrgentes = (req, res) =>
  repo
    .fetchNotificaciones({ urgencia: "U" })
    .then((rows) => res.json(rows))
    .catch((err) => res.status(500).json({ error: err.message }));