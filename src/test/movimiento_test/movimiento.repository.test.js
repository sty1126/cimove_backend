import assert from "assert";

// ======================
// Mock pool
// ======================
function makePoolMock() {
  const executed = [];
  return {
    executed,
    async query(sql, params) {
      executed.push({ sql, params });
      if (sql.includes("TIPOMOV")) {
        return { rows: [{ id: 1, descripcion: "Ingreso" }] };
      }
      if (sql.includes("MOVPRODUCTO") && sql.includes("SELECT")) {
        return { rows: [{ id: 99, tipo: "Ingreso" }] };
      }
      return { rows: [{ id: 123 }] };
    },
    async connect() {
      const self = this;
      return {
        async query(sql, params) {
          self.executed.push({ sql, params });
          return { rows: [{ id: 500 }] };
        },
        async release() {
          self.executed.push({ action: "release" });
        }
      };
    }
  };
}
const pool = makePoolMock();

// ======================
// Repo  usando pool mock
// ======================
const repo = {
  async fetchTipoMovimientos() {
    const result = await pool.query("SELECT * FROM TIPOMOV WHERE ESTADO_TIPOMOV = 'A'");
    return result.rows;
  },

  async fetchMovimientos() {
    const result = await pool.query("SELECT * FROM MOVPRODUCTO");
    return result.rows;
  },

  async insertMovimiento(data) {
    const {
      ID_TIPOMOV_MOVIMIENTO,
      ID_PRODUCTO_MOVIMIENTO,
      CANTIDAD_MOVIMIENTO,
      ID_SEDE_MOVIMIENTO,
      ID_SEDEDESTINO_MOVIMIENTO = null,
    } = data;

    if (!ID_TIPOMOV_MOVIMIENTO || !ID_PRODUCTO_MOVIMIENTO || !CANTIDAD_MOVIMIENTO || !ID_SEDE_MOVIMIENTO) {
      throw { status: 400, message: "Campos obligatorios faltantes" };
    }

    if (ID_SEDE_MOVIMIENTO === ID_SEDEDESTINO_MOVIMIENTO) {
      throw { status: 400, message: "La sede origen y destino no pueden ser iguales" };
    }

    const client = await pool.connect();
    try {
      await client.query("BEGIN");
      const result = await client.query("INSERT INTO MOVPRODUCTO (...) VALUES (...) RETURNING *", []);
      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests movimiento.repository");

  // 1. fetchTipoMovimientos
  {
    const result = await repo.fetchTipoMovimientos();
    assert.strictEqual(result[0].descripcion, "Ingreso");
    console.log("✔ fetchTipoMovimientos OK");
  }

  // 2. fetchMovimientos
  {
    const result = await repo.fetchMovimientos();
    assert.strictEqual(result[0].tipo, "Ingreso");
    console.log("✔ fetchMovimientos OK");
  }

  // 3. insertMovimiento con éxito
  {
    const movimiento = {
      ID_TIPOMOV_MOVIMIENTO: 1,
      ID_PRODUCTO_MOVIMIENTO: 10,
      CANTIDAD_MOVIMIENTO: 5,
      ID_SEDE_MOVIMIENTO: 1
    };
    const result = await repo.insertMovimiento(movimiento);
    assert.ok(result.id);
    console.log("✔ insertMovimiento éxito OK");
  }

  // 4. insertMovimiento error por campos faltantes
  {
    let error;
    try {
      await repo.insertMovimiento({});
    } catch (err) {
      error = err;
    }
    assert.strictEqual(error.status, 400);
    console.log("✔ insertMovimiento error campos faltantes OK");
  }

  // 5. insertMovimiento error sede origen=destino
  {
    let error;
    try {
      await repo.insertMovimiento({
        ID_TIPOMOV_MOVIMIENTO: 5,
        ID_PRODUCTO_MOVIMIENTO: 10,
        CANTIDAD_MOVIMIENTO: 5,
        ID_SEDE_MOVIMIENTO: 1,
        ID_SEDEDESTINO_MOVIMIENTO: 1
      });
    } catch (err) {
      error = err;
    }
    assert.strictEqual(error.status, 400);
    console.log("✔ insertMovimiento error sede igual OK");
  }

  console.log("✅ Todos los tests de movimiento.repository pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
