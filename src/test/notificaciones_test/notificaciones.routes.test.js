import express from "express";
import http from "http";
import router from "../../modules/notificaciones/notificaciones.routes.js"; 

// Creamos una app temporal solo para pruebas
const app = express();
app.use(express.json());
app.use("/api/notificaciones", router);


const server = http.createServer(app);

server.listen(0, async () => {
  const { port } = server.address();
  const baseUrl = `http://localhost:${port}/api/notificaciones`;

  try {
    console.log("🔹 Probando GET todas activas...");
    let res = await fetch(baseUrl);
    console.log("GET /", res.status, await res.json());

    console.log("🔹 Probando POST crear notificación...");
    res = await fetch(baseUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nombre_notificacion: "Test",
        descripcion_notificacion: "Esto es una prueba",
        urgencia_notificacion: "A",
        fechainicio_notificacion: "2025-08-31",
      }),
    });
    console.log("POST /", res.status, await res.json());

    console.log("🔹 Probando GET completadas...");
    res = await fetch(`${baseUrl}/completadas`);
    console.log("GET /completadas", res.status, await res.json());

    console.log("🔹 Probando PUT marcar como completada...");
    res = await fetch(`${baseUrl}/1/completar`, { method: "PUT" });
    console.log("PUT /:id/completar", res.status, await res.json());

    console.log("🔹 Probando PUT restaurar notificación...");
    res = await fetch(`${baseUrl}/1/restaurar`, { method: "PUT" });
    console.log("PUT /:id/restaurar", res.status, await res.json());

    console.log("🔹 Probando PUT inactivar...");
    res = await fetch(`${baseUrl}/1/inactivar`, { method: "PUT" });
    console.log("PUT /:id/inactivar", res.status, await res.json());

    console.log("🔹 Probando GET por ID...");
    res = await fetch(`${baseUrl}/1`);
    console.log("GET /:id", res.status, await res.json());

    console.log("🔹 Probando test-email...");
    res = await fetch(`${baseUrl}/test-email`);
    console.log("GET /test-email", res.status, await res.json());

  } catch (err) {
    console.error("❌ Error en pruebas:", err.message);
  } finally {
    server.close(); // 👈 cerramos el server al terminar
  }
});
