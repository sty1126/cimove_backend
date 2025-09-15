import assert from "assert";

// ======================
// Mock repo + mailer
// ======================
const repo = {
  fetchNotificaciones: async (q) => [{ id: 1, titulo: "Test", ...q }],
  fetchNotificacionById: async (id) => ({ id, titulo: "Detalle" }),
  insertNotificacion: async (body) => ({ id: 10, ...body }),
  updateNotificacion: async (id, body) => ({ id, ...body }),
  inactivarNotificacion: async (id) => ({ id, estado: "I" }),
  completarNotificacion: async (id) => ({ id, estado: "C" }),
  restaurarNotificacion: async (id) => ({ id, estado: "P" }),
};
async function enviarCorreoNotificacion() {
  return true;
}

// ======================
// Controllers 
// ======================
const controller = {
  getNotificaciones: (req, res) =>
    repo.fetchNotificaciones(req.query).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionById: (req, res) =>
    repo.fetchNotificacionById(req.params.id).then(row => res.json(row))
      .catch(err => res.status(500).json({ error: err.message })),

  createNotificacion: (req, res) =>
    repo.insertNotificacion(req.body).then(row => {
      enviarCorreoNotificacion(row).catch(() => {});
      res.json(row);
    }).catch(err => res.status(500).json({ error: err.message })),

  updateNotificacion: (req, res) =>
    repo.updateNotificacion(req.params.id, req.body).then(row => res.json(row))
      .catch(err => res.status(500).json({ error: err.message })),

  inactivarNotificacion: (req, res) =>
    repo.inactivarNotificacion(req.params.id).then(row => res.json(row))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesCompletadas: (req, res) =>
    repo.fetchNotificaciones({ estado: "C" }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  marcarNotificacionCompletada: (req, res) =>
    repo.completarNotificacion(req.params.id).then(row => res.json(row))
      .catch(err => res.status(500).json({ error: err.message })),

  restaurarNotificacionPendiente: (req, res) =>
    repo.restaurarNotificacion(req.params.id).then(row => res.json(row))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesPorEstado: (req, res) =>
    repo.fetchNotificaciones({ estado: req.query.estado }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesPorUrgencia: (req, res) =>
    repo.fetchNotificaciones({ urgencia: req.query.urgencia }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesPorFechas: (req, res) =>
    repo.fetchNotificaciones({ fechaInicio: req.query.fechaInicio, fechaFin: req.query.fechaFin })
      .then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesHoy: (req, res) => {
    const hoy = new Date().toISOString().split("T")[0];
    repo.fetchNotificaciones({ fecha: hoy }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message }));
  },

  getNotificacionesPendientes: (req, res) =>
    repo.fetchNotificaciones({ estado: "P" }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),

  getNotificacionesUrgentes: (req, res) =>
    repo.fetchNotificaciones({ urgencia: "U" }).then(rows => res.json(rows))
      .catch(err => res.status(500).json({ error: err.message })),
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
  console.log("▶ Tests notificaciones.controller");

  // 1. getNotificaciones
  {
    const res = makeRes();
    await controller.getNotificaciones({ query: {} }, res);
    assert.strictEqual(res.body[0].titulo, "Test");
    console.log("✔ getNotificaciones OK");
  }

  // 2. createNotificacion
  {
    const res = makeRes();
    await controller.createNotificacion({ body: { titulo: "Nueva" } }, res);
    assert.strictEqual(res.body.titulo, "Nueva");
    console.log("✔ createNotificacion OK");
  }

  // 3. updateNotificacion
  {
    const res = makeRes();
    await controller.updateNotificacion({ params: { id: "1" }, body: { titulo: "Editada" } }, res);
    assert.strictEqual(res.body.titulo, "Editada");
    console.log("✔ updateNotificacion OK");
  }

  // 4. inactivarNotificacion
  {
    const res = makeRes();
    await controller.inactivarNotificacion({ params: { id: "1" } }, res);
    assert.strictEqual(res.body.estado, "I");
    console.log("✔ inactivarNotificacion OK");
  }

  // 5. getNotificacionesHoy
  {
    const res = makeRes();
    await controller.getNotificacionesHoy({ query: {} }, res);
    assert.ok(Array.isArray(res.body));
    console.log("✔ getNotificacionesHoy OK");
  }

  console.log("✅ Todos los tests de notificaciones.controller pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
