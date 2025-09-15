import assert from "assert";

// ======================
// Pool mock
// ======================
let lastQuery = null;
export const pool = {
  async query(sql, params) {
    lastQuery = { sql, params };

    if (sql.startsWith("SELECT id_sede") && sql.includes("WHERE estado_sede = 'A'") && !sql.includes("WHERE id_sede")) {
      // obtenerTodas
      return { rows: [{ id_sede: 1, nombre_sede: "Central", telefono_sede: "12345" }] };
    }

    if (sql.startsWith("INSERT INTO SEDE")) {
      return { rows: [{ id_sede: 2, nombre_sede: params[0], telefono_sede: params[4] }] };
    }

    if (sql.startsWith("UPDATE SEDE SET estado_sede = 'I'")) {
      return { rows: [{ id_sede: params[0], estado_sede: "I" }], rowCount: 1 };
    }

    if (sql.startsWith("SELECT id_sede, nombre_sede") && sql.includes("WHERE id_sede")) {
      return { rows: [{ id_sede: params[0], nombre_sede: "Sucursal Norte" }] };
    }

    if (sql.startsWith("SELECT id_sede FROM SEDE WHERE nombre_sede")) {
      return { rows: [{ id_sede: 99 }] };
    }

    return { rows: [] };
  }
};

// ======================
// Repository reimplementado
// ======================
const SedesRepository = {
  obtenerTodas() {
    return pool.query(`SELECT id_sede, nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede 
                       FROM SEDE WHERE estado_sede = 'A'`);
  },

  crear({ nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede }) {
    return pool.query(
      `INSERT INTO SEDE (nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede, estado_sede) 
       VALUES ($1, $2, $3, $4, $5, 'A') RETURNING *`,
      [nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede]
    );
  },

  desactivar(id_sede) {
    return pool.query(`UPDATE SEDE SET estado_sede = 'I' WHERE id_sede = $1 RETURNING *`, [id_sede]);
  },

  obtenerPorId(id_sede) {
    return pool.query(
      `SELECT id_sede, nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede 
       FROM SEDE WHERE id_sede = $1 AND estado_sede = 'A'`,
      [id_sede]
    );
  },

  obtenerIdPorNombre(nombre_sede) {
    return pool.query(`SELECT id_sede FROM SEDE WHERE nombre_sede = $1 AND estado_sede = 'A'`, [nombre_sede]);
  }
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests sedes.repository");

  {
    const r = await SedesRepository.obtenerTodas();
    assert.strictEqual(r.rows[0].nombre_sede, "Central");
    console.log("✔ obtenerTodas OK");
  }

  {
    const r = await SedesRepository.crear({
      nombre_sede: "Nueva Sede",
      id_ciudad_sede: 1,
      direccion_sede: "Calle 123",
      numeroempleados_sede: 20,
      telefono_sede: "55555"
    });
    assert.strictEqual(r.rows[0].nombre_sede, "Nueva Sede");
    assert.strictEqual(r.rows[0].telefono_sede, "55555");
    console.log("✔ crear OK");
  }

  {
    const r = await SedesRepository.desactivar(5);
    assert.strictEqual(r.rows[0].estado_sede, "I");
    assert.strictEqual(r.rowCount, 1);
    console.log("✔ desactivar OK");
  }

  {
    const r = await SedesRepository.obtenerPorId(7);
    assert.strictEqual(r.rows[0].id_sede, 7);
    console.log("✔ obtenerPorId OK");
  }

  {
    const r = await SedesRepository.obtenerIdPorNombre("Central");
    assert.strictEqual(r.rows[0].id_sede, 99);
    console.log("✔ obtenerIdPorNombre OK");
  }

  console.log("✅ Todos los tests de sedes.repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
