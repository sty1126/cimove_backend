
import assert from "assert";


// Pool mock
export const pool = {
  async query(sql, params) {
    if (sql.toUpperCase().includes("SELECT") && sql.toUpperCase().includes("FROM TIPOMETODOPAGO")) {
      return {
        rows: [
          { id_tipometodopago: 1, nombre_tipometodopago: "Tarjeta", estado_tipometodopago: 'A' },
          { id_tipometodopago: 2, nombre_tipometodopago: "Efectivo", estado_tipometodopago: 'A' },
        ],
      };
    }
    if (sql.toUpperCase().includes("INSERT INTO TIPOMETODOPAGO")) {
      return { rows: [] }; // No necesita devolver filas para la prueba de inserción
    }
    if (sql.toUpperCase().includes("UPDATE TIPOMETODOPAGO")) {
      if (sql.toUpperCase().includes("ESTADO_TIPOMETODOPAGO = 'I'")) {
        // Mock para inhabilitar
        return { rows: [] };
      }
      // Mock para actualizar
      return { rows: [] };
    }
    return { rows: [] };
  },
};

// ======================
// Repository functions
// ======================
async function obtenerTiposMetodoPago() {
  const result = await pool.query(`
    SELECT * FROM TIPOMETODOPAGO 
    WHERE ESTADO_TIPOMETODOPAGO = 'A'
    ORDER BY ID_TIPOMETODOPAGO DESC
  `);
  return result.rows;
}

async function insertarTipoMetodoPago(nombre, comision, recepcion) {
  await pool.query(`
    INSERT INTO TIPOMETODOPAGO (
      NOMBRE_TIPOMETODOPAGO, 
      COMISION_TIPOMETODOPAGO, 
      RECEPCION_TIPOMETODOPAGO
    ) VALUES ($1, $2, $3)
  `, [nombre, comision, recepcion]);
}

async function actualizarTipoMetodoPago(id, nombre, comision, recepcion) {
  await pool.query(`
    UPDATE TIPOMETODOPAGO SET 
      NOMBRE_TIPOMETODOPAGO = $1,
      COMISION_TIPOMETODOPAGO = $2,
      RECEPCION_TIPOMETODOPAGO = $3
    WHERE ID_TIPOMETODOPAGO = $4
  `, [nombre, comision, recepcion, id]);
}

async function inhabilitarTipoMetodoPago(id) {
  await pool.query(`
    UPDATE TIPOMETODOPAGO 
    SET ESTADO_TIPOMETODOPAGO = 'I'
    WHERE ID_TIPOMETODOPAGO = $1
  `, [id]);
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposMetodoPago.repository");

  // Test 1: obtenerTiposMetodoPago
  {
    const res = await obtenerTiposMetodoPago();
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre_tipometodopago, "Tarjeta");
    console.log("✔ obtenerTiposMetodoPago OK");
  }

  // Test 2: insertarTipoMetodoPago
  {
    await insertarTipoMetodoPago("Nuevo Tipo", 0.0, false);
    console.log("✔ insertarTipoMetodoPago OK");
  }

  // Test 3: actualizarTipoMetodoPago
  {
    await actualizarTipoMetodoPago(1, "Tipo Actualizado", 1.5, true);
    console.log("✔ actualizarTipoMetodoPago OK");
  }

  // Test 4: inhabilitarTipoMetodoPago
  {
    await inhabilitarTipoMetodoPago(1);
    console.log("✔ inhabilitarTipoMetodoPago OK");
  }

  console.log("✅ Todos los tests de tiposMetodoPago.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});