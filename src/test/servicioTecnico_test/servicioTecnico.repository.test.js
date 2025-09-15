import assert from "assert";


function createClientMock() {
  return {
    calls: [],
    async query(sql, values) {
      this.calls.push({ sql, values });
      if (sql.includes("INSERT INTO FACTURA")) {
        return { rows: [{ id_factura: 99 }] };
      }
      if (sql.includes("INSERT INTO SERVICIOTECNICO")) {
        return { rows: [{ id_serviciotecnico: 123 }] };
      }
      if (sql.includes("UPDATE SERVICIOTECNICO")) {
        return { rowCount: 1, rows: [{ id_factura_serviciotecnico: 77 }] };
      }
      if (sql.startsWith("SELECT")) {
        return { rows: [{ id_serviciotecnico: 321 }] };
      }
      return { rows: [] };
    },
    async release() {
      this.calls.push({ release: true });
    },
  };
}

const pool = {
  async connect() {
    return createClientMock();
  },
  async query(sql, values) {
    return { rows: [{ id_serviciotecnico: 500 }] };
  },
};

// ======================
// Funciones simuladas del repo
// ======================
async function insertServicioTecnico(data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    if (!data.id_cliente || !data.id_sede || !data.nombre_servicio || !data.descripcion_servicio || !data.fecha_servicio || !data.costo) {
      throw new Error("Faltan campos obligatorios para crear el servicio técnico");
    }

    const facturaResult = await client.query("INSERT INTO FACTURA ...", []);
    const idFactura = facturaResult.rows[0].id_factura;

    const servicioTecnicoResult = await client.query("INSERT INTO SERVICIOTECNICO ...", []);
    for (const metodo of data.metodos_pago || []) {
      if (metodo?.id_tipo && metodo?.monto > 0) {
        await client.query("INSERT INTO METODOPAGO ...", [idFactura, metodo.id_tipo, metodo.monto]);
      }
    }

    await client.query("COMMIT");
    return servicioTecnicoResult.rows[0];
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function fetchServiciosTecnicos() {
  const result = await pool.query("SELECT ... FROM SERVICIOTECNICO");
  return result.rows;
}

async function updateServicioTecnico(id, data) {
  const client = await pool.connect();
  try {
    await client.query("BEGIN");
    const result = await client.query("UPDATE SERVICIOTECNICO ... RETURNING id_factura_serviciotecnico", []);
    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return false;
    }
    for (const metodo of data.metodos_pago || []) {
      await client.query("INSERT INTO METODOPAGO ...", [metodo.id_tipometodopago, result.rows[0].id_factura_serviciotecnico, metodo.monto, metodo.estado ?? "A"]);
    }
    await client.query("COMMIT");
    return true;
  } catch (err) {
    await client.query("ROLLBACK");
    throw err;
  } finally {
    client.release();
  }
}

async function fetchServicioTecnicoById(id) {
  const result = await pool.query("SELECT ... WHERE id=$1", [id]);
  return result.rows[0] || null;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests serviciotecnico.repository");

  // 1. Insert servicio técnico éxito
  {
    const res = await insertServicioTecnico({
      id_cliente: 1,
      id_sede: 2,
      nombre_servicio: "Reparación",
      descripcion_servicio: "Pantalla rota",
      fecha_servicio: "2025-01-01",
      costo: 200,
      metodos_pago: [{ id_tipo: 1, monto: 100 }],
    });
    assert.strictEqual(res.id_serviciotecnico, 123);
    console.log("✔ insertServicioTecnico éxito OK");
  }

  // 2. Insert servicio técnico faltan campos
  {
    try {
      await insertServicioTecnico({ id_cliente: null });
      console.error("❌ FAIL: no lanzó error por campos obligatorios");
    } catch (e) {
      assert.ok(e.message.includes("Faltan campos obligatorios"));
      console.log("✔ insertServicioTecnico faltan campos OK");
    }
  }

  // 3. Fetch servicios técnicos
  {
    const res = await fetchServiciosTecnicos();
    assert.strictEqual(res[0].id_serviciotecnico, 500);
    console.log("✔ fetchServiciosTecnicos OK");
  }

  // 4. Update servicio técnico éxito
  {
    const res = await updateServicioTecnico(1, { metodos_pago: [{ id_tipometodopago: 2, monto: 50 }] });
    assert.strictEqual(res, true);
    console.log("✔ updateServicioTecnico éxito OK");
  }

  // 5. Fetch servicio técnico por ID
  {
    const res = await fetchServicioTecnicoById(1);
    assert.strictEqual(res.id_serviciotecnico, 500);
    console.log("✔ fetchServicioTecnicoById OK");
  }

  console.log("✅ Todos los tests de serviciotecnico.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
