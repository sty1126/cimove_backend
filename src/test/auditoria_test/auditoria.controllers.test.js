
import assert from "assert";


const fakeService = {
  getAuditorias: async (filtros) => {
    if (filtros.idUsuario === "invalido") throw new Error("ID de usuario inválido");
    if (filtros.fechaInicio && !filtros.fechaFin) throw new Error("Faltan fechas");
    return [{ id: 1, ...filtros }];
  },
};


// Controller simulado 

async function getAuditoriasController(req, res) {
  try {
    const { idUsuario, idTipoMov } = req.params;
    const { fechaInicio, fechaFin } = req.query;

    const filtros = { idUsuario, idTipoMov, fechaInicio, fechaFin };

    const auditorias = await fakeService.getAuditorias(filtros);
    res.json(auditorias);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


// Mock Express response

function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) {
    this.statusCode = code;
    return this;
  };
  res.json = function (data) {
    this.body = data;
    return this;
  };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests auditoria.controllers");

  // Test 1: getAuditoriasController - Sin filtros
  {
    const req = { params: {}, query: {} };
    const res = createResMock();
    await getAuditoriasController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    assert.deepStrictEqual(res.body[0], { id: 1, idUsuario: undefined, idTipoMov: undefined, fechaInicio: undefined, fechaFin: undefined });
    console.log("✔ getAuditoriasController sin filtros OK");
  }

  // Test 2: getAuditoriasController - Con filtro de usuario
  {
    const req = { params: { idUsuario: 123 }, query: {} };
    const res = createResMock();
    await getAuditoriasController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body[0].idUsuario, 123);
    console.log("✔ getAuditoriasController con filtro de usuario OK");
  }

  // Test 3: getAuditoriasController - Con filtro de fechas
  {
    const req = { params: {}, query: { fechaInicio: "2023-01-01", fechaFin: "2023-01-31" } };
    const res = createResMock();
    await getAuditoriasController(req, res);
    assert.strictEqual(res.statusCode, 200);
    assert.deepStrictEqual(res.body[0].fechaInicio, "2023-01-01");
    console.log("✔ getAuditoriasController con filtro de fechas OK");
  }

  // Test 4: getAuditoriasController - Error del servicio
  {
    const req = { params: { idUsuario: "invalido" }, query: {} };
    const res = createResMock();
    await getAuditoriasController(req, res);
    assert.strictEqual(res.statusCode, 400);
    assert.strictEqual(res.body.error, "ID de usuario inválido");
    console.log("✔ getAuditoriasController error del servicio OK");
  }

  console.log("✅ Todos los tests de auditoria.controllers pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});