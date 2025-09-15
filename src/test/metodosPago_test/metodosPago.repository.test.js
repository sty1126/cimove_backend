import assert from "assert";


let lastQuery = null;
export const pool = {
  async query(sql, params) {
    lastQuery = { sql, params };
    // Comportamientos distintos según la consulta 
    if (sql.includes("INSERT INTO METODOPAGO")) {
      return { rows: [{ id_metodopago: 1, idFactura: params[1], monto: params[2] }] };
    }
    if (sql.includes("WHERE mp.ID_FACTURA_METODOPAGO = $1")) {
      return { rows: [{ idFactura: params[0], nombre_tipometodopago: "Efectivo" }] };
    }
    if (sql.includes("FROM METODOPAGO mp") && sql.includes("ORDER BY")) {
      return { rows: [{ id_metodopago: 99, nombre_tipometodopago: "Tarjeta" }] };
    }
    if (sql.includes("UPDATE METODOPAGO")) {
      return { rows: [{ id_metodopago: params[0], estado_metodopago: "I" }] };
    }
    return { rows: [] };
  }
};

// ==== Repository reimplementado con pool ====
async function insertMetodoPago(idFactura, idTipoMetodoPago, monto) {
  const result = await pool.query(
    `INSERT INTO METODOPAGO (
      ID_TIPOMETODOPAGO_METODOPAGO,
      ID_FACTURA_METODOPAGO,
      MONTO_METODOPAGO,
      ESTADO_METODOPAGO
    ) VALUES ($1, $2, $3, 'A')
    RETURNING *`,
    [idTipoMetodoPago, idFactura, monto]
  );
  return result.rows[0];
}

async function fetchMetodosPagoByFacturaId(idFactura) {
  const result = await pool.query(
    `SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
     FROM METODOPAGO mp
     JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
     WHERE mp.ID_FACTURA_METODOPAGO = $1 AND mp.ESTADO_METODOPAGO = 'A'`,
    [idFactura]
  );
  return result.rows;
}

async function fetchAllActiveMetodosPago() {
  const result = await pool.query(`
    SELECT mp.*, tmp.NOMBRE_TIPOMETODOPAGO
    FROM METODOPAGO mp
    JOIN TIPOMETODOPAGO tmp ON mp.ID_TIPOMETODOPAGO_METODOPAGO = tmp.ID_TIPOMETODOPAGO
    WHERE mp.ESTADO_METODOPAGO = 'A'
    ORDER BY mp.ID_METODOPAGO DESC
  `);
  return result.rows;
}

async function deactivateMetodoPagoById(idMetodoPago) {
  const result = await pool.query(
    `UPDATE METODOPAGO
     SET ESTADO_METODOPAGO = 'I'
     WHERE ID_METODOPAGO = $1
     RETURNING *`,
    [idMetodoPago]
  );
  return result.rows[0];
}

// ==== Tests ====
async function run() {
  console.log("▶ Tests metodosPago.repository");

  {
    const r = await insertMetodoPago(10, 2, 500);
    assert.strictEqual(r.idFactura, 10);
    assert.strictEqual(r.monto, 500);
    console.log("✔ insertMetodoPago OK");
  }

  {
    const r = await fetchMetodosPagoByFacturaId(15);
    assert.strictEqual(r[0].idFactura, 15);
    console.log("✔ fetchMetodosPagoByFacturaId OK");
  }

  {
    const r = await fetchAllActiveMetodosPago();
    assert.strictEqual(r[0].nombre_tipometodopago, "Tarjeta");
    console.log("✔ fetchAllActiveMetodosPago OK");
  }

  {
    const r = await deactivateMetodoPagoById(33);
    assert.strictEqual(r.estado_metodopago, "I");
    console.log("✔ deactivateMetodoPagoById OK");
  }

  console.log("✅ Todos los tests de metodosPago.repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
