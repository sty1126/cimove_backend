import assert from "assert";

// Mock de pool.query
function makePoolMock() {
  return {
    log: [],
    async query(sql, params) {
      this.log.push({ sql, params });
      if (sql.includes("INSERT")) return { rows: [{ id_abonofactura: 1 }] };
      if (sql.includes("UPDATE")) return { rows: [{ id_abonofactura: params[0], estado_abonofactura: "I" }] };
      if (sql.includes("SUM")) return { rows: [{ total: 500 }] };
      return { rows: [] };
    }
  };
}

// Repository simulado con pool inyectado
function makeRepo(pool) {
  return {
    insertarAbono: (idFactura, fecha, monto) => pool.query("INSERT ... RETURNING *", [idFactura, fecha, monto]).then(r => r.rows[0]),
    anularAbonoPorId: (id) => pool.query("UPDATE ... RETURNING *", [id]).then(r => r.rows[0]),
    obtenerTotalAbonadoPorFactura: (idFactura) => pool.query("SELECT SUM ...", [idFactura]).then(r => r.rows[0]),
  };
}

async function run() {
  console.log("▶ Tests repository_abonos");
  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Insertar
  {
    const r = await repo.insertarAbono(10, "2025-09-13", 100);
    assert.strictEqual(r.id_abonofactura, 1);
  }

  // 2. Anular
  {
    const r = await repo.anularAbonoPorId(7);
    assert.strictEqual(r.estado_abonofactura, "I");
  }

  // 3. Total abonado
  {
    const r = await repo.obtenerTotalAbonadoPorFactura(10);
    assert.strictEqual(r.total, 500);
  }

  console.log("✔ repository_abonos OK");
}
run();
