import assert from "assert";

// ======================
// Mock repo
// ======================
const repo = {
  fetchNotificaciones: async () => [{ id: 1, titulo: "Servicio" }],
  fetchNotificacionById: async (id) => id === "404" ? null : { id, titulo: "Detalle" },
  insertNotificacion: async (body) => ({ id: 2, ...body }),
  updateNotificacion: async (id, body) => id === "404" ? null : ({ id, ...body }),
  inactivarNotificacion: async (id) => id === "404" ? null : ({ id, estado: "I" }),
  completarNotificacion: async (id) => id === "404" ? null : ({ id, estado: "C" }),
  restaurarNotificacion: async (id) => id === "404" ? null : ({ id, estado: "P" }),
};

// ======================
// Service fake con repo mock
// ======================
const service = {
  async getNotificaciones(req, res) {
    try {
      const data = await repo.fetchNotificaciones(req.query);
      res.json(data);
    } catch {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async getNotificacionById(req, res) {
    const noti = await repo.fetchNotificacionById(req.params.id);
    if (!noti) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json(noti);
  },
  async createNotificacion(req, res) {
    try {
      const nueva = await repo.insertNotificacion(req.body);
      res.status(201).json({ message: "Notificación creada con éxito", notificacion: nueva });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  async updateNotificacion(req, res) {
    const actualizada = await repo.updateNotificacion(req.params.id, req.body);
    if (!actualizada) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({ message: "Notificación actualizada con éxito", notificacion: actualizada });
  },
  async inactivarNotificacion(req, res) {
    const inactiva = await repo.inactivarNotificacion(req.params.id);
    if (!inactiva) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({ message: "Notificación inactivada con éxito", notificacion: inactiva });
  },
  async marcarNotificacionCompletada(req, res) {
    const actualizada = await repo.completarNotificacion(req.params.id);
    if (!actualizada) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({ message: "Notificación marcada como completada", notificacion: actualizada });
  },
  async restaurarNotificacionPendiente(req, res) {
    const actualizada = await repo.restaurarNotificacion(req.params.id);
    if (!actualizada) return res.status(404).json({ error: "Notificación no encontrada" });
    res.json({ message: "Notificación restaurada a pendiente", notificacion: actualizada });
  },
};

// ======================
// Mock res
// ======================
function makeRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (c) { this.statusCode = c; return this; };
  res.json = function (d) { this.body = d; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests notificaciones.service");

  // 1. getNotificaciones
  {
    const res = makeRes();
    await service.getNotificaciones({ query: {} }, res);
    assert.strictEqual(res.body[0].titulo, "Servicio");
    console.log("✔ getNotificaciones OK");
  }

  // 2. getNotificacionById OK
  {
    const res = makeRes();
    await service.getNotificacionById({ params: { id: "1" } }, res);
    assert.strictEqual(res.body.id, "1");
    console.log("✔ getNotificacionById OK");
  }

  // 3. getNotificacionById no encontrada
  {
    const res = makeRes();
    await service.getNotificacionById({ params: { id: "404" } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getNotificacionById no encontrada OK");
  }

  // 4. createNotificacion
  {
    const res = makeRes();
    await service.createNotificacion({ body: { titulo: "Nueva" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.notificacion.titulo, "Nueva");
    console.log("✔ createNotificacion OK");
  }

  // 5. updateNotificacion no encontrada
  {
    const res = makeRes();
    await service.updateNotificacion({ params: { id: "404" }, body: {} }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ updateNotificacion no encontrada OK");
  }

  // 6. inactivarNotificacion
  {
    const res = makeRes();
    await service.inactivarNotificacion({ params: { id: "2" } }, res);
    assert.strictEqual(res.body.notificacion.estado, "I");
    console.log("✔ inactivarNotificacion OK");
  }

  // 7. marcarNotificacionCompletada
  {
    const res = makeRes();
    await service.marcarNotificacionCompletada({ params: { id: "3" } }, res);
    assert.strictEqual(res.body.notificacion.estado, "C");
    console.log("✔ marcarNotificacionCompletada OK");
  }

  console.log("✅ Todos los tests de notificaciones.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
