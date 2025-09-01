import express from "express";
import http from "http";
import {
  getNotificaciones,
  getNotificacionById,
  createNotificacion,
  updateNotificacion,
  inactivarNotificacion,
  marcarNotificacionCompletada,
  restaurarNotificacionPendiente,
} from "../../modules/notificaciones/notificaciones.controllers.js";


import * as repo from "../../modules/notificaciones/notificaciones.repository.js";

// Sobrescribimos las funciones de repo con datos simulados
repo.fetchNotificaciones = async (query) => [
  { id: 1, nombre_notificacion: "Test", estado: query?.estado || "A" },
];
repo.fetchNotificacionById = async (id) =>
  id === "1" ? { id: 1, nombre_notificacion: "Por ID" } : null;
repo.insertNotificacion = async (data) => ({ id: 2, ...data });
repo.updateNotificacion = async (id, data) =>
  id === "1" ? { id: 1, ...data } : null;
repo.inactivarNotificacion = async (id) =>
  id === "1" ? { id: 1, estado: "I" } : null;
repo.completarNotificacion = async (id) =>
  id === "1" ? { id: 1, estado: "C" } : null;
repo.restaurarNotificacion = async (id) =>
  id === "1" ? { id: 1, estado: "P" } : null;

// 🚏 Configuración express con los controladores
const app = express();
app.use(express.json());

app.get("/api/notificaciones", getNotificaciones);
app.get("/api/notificaciones/:id", getNotificacionById);
app.post("/api/notificaciones", createNotificacion);
app.put("/api/notificaciones/:id", updateNotificacion);
app.put("/api/notificaciones/:id/inactivar", inactivarNotificacion);
app.put("/api/notificaciones/:id/completar", marcarNotificacionCompletada);
app.put("/api/notificaciones/:id/restaurar", restaurarNotificacionPendiente);

// 🔹 servidor temporal solo para pruebas
const server = http.createServer(app);

server.listen(0, async () => {
  const { port } = server.address();
  const baseUrl = `http://localhost:${port}/api/notificaciones`;

  try {
    console.log("🔹 GET todas");
    let res = await fetch(baseUrl);
    console.log(await res.json());

    console.log("🔹 GET por ID (1)");
    res = await fetch(`${baseUrl}/1`);
    console.log(await res.json());

    console.log("🔹 GET por ID (999 no existe)");
    res = await fetch(`${baseUrl}/999`);
    console.log(res.status, await res.json());

    console.log("🔹 POST crear");
    res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_notificacion: "Nueva",
        descripcion_notificacion: "Prueba",
        urgencia_notificacion: "U",
        fechainicio_notificacion: "2025-08-31",
        fechafin_notificacion: "2025-09-01",
        horainicio_notificacion: "08:00",
        horafin_notificacion: "09:00",
      }),
    });
    console.log(await res.json());

    console.log("🔹 PUT actualizar");
    res = await fetch(`${baseUrl}/1`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre_notificacion: "Modificada" }),
    });
    console.log(await res.json());

    console.log("🔹 PUT inactivar");
    res = await fetch(`${baseUrl}/1/inactivar`, { method: "PUT" });
    console.log(await res.json());

    console.log("🔹 PUT completar");
    res = await fetch(`${baseUrl}/1/completar`, { method: "PUT" });
    console.log(await res.json());

    console.log("🔹 PUT restaurar");
    res = await fetch(`${baseUrl}/1/restaurar`, { method: "PUT" });
    console.log(await res.json());
  } catch (err) {
    console.error("❌ Error en pruebas:", err.message);
  } finally {
    server.close();
  }
});
