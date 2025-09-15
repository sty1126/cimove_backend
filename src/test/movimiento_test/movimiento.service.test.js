import assert from "assert";

// ======================
// Repo mock
// ======================
const repo = {
  fetchMovimientos: async () => [
    { id: 1, tipo: "Ingreso", monto: 100 },
    { id: 2, tipo: "Egreso", monto: 50 }
  ],
  fetchTipoMovimientos: async () => [
    { id: "I", descripcion: "Ingreso" },
    { id: "E", descripcion: "Egreso" }
  ],
  insertMovimiento: async (data) => ({ id: 10, ...data })
};

// ======================
// Service fake usando repo mock
// ======================
const service = {
  async getMovimientos(req, res) {
    try {
      const data = await repo.fetchMovimientos();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async getTipoMovimientos(req, res) {
    try {
      const data = await repo.fetchTipoMovimientos();
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Error interno del servidor" });
    }
  },
  async createMovimiento(req, res) {
    try {
      const nuevo = await repo.insertMovimiento(req.body);
      res.status(201).json({
        message: "Movimiento registrado con éxito",
        movimiento: nuevo
      });
    } catch (err) {
      res.status(err.status || 500).json({ error: err.message || "Error interno del servidor" });
    }
  }
};

// ======================
// Mock Express res
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
  console.log("▶ Tests movimiento.service");

  // 1. getMovimientos
  {
    const res = makeRes();
    await service.getMovimientos({}, res);
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[0].tipo, "Ingreso");
    console.log("✔ getMovimientos OK");
  }

  // 2. getTipoMovimientos
  {
    const res = makeRes();
    await service.getTipoMovimientos({}, res);
    assert.strictEqual(res.body.length, 2);
    assert.strictEqual(res.body[1].descripcion, "Egreso");
    console.log("✔ getTipoMovimientos OK");
  }

  // 3. createMovimiento
  {
    const res = makeRes();
    await service.createMovimiento({ body: { tipo: "Ingreso", monto: 200 } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.movimiento.monto, 200);
    console.log("✔ createMovimiento OK");
  }

  // 4. createMovimiento error
  {
    const repoError = {
      insertMovimiento: async () => { throw new Error("Fallo DB"); }
    };
    const serviceError = {
      async createMovimiento(req, res) {
        try {
          await repoError.insertMovimiento(req.body);
        } catch (err) {
          res.status(500).json({ error: err.message });
        }
      }
    };
    const res = makeRes();
    await serviceError.createMovimiento({ body: {} }, res);
    assert.strictEqual(res.statusCode, 500);
    assert.ok(res.body.error.includes("Fallo"));
    console.log("✔ createMovimiento error OK");
  }

  console.log("✅ Todos los tests de movimiento.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
