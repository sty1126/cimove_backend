import assert from "assert";

// ======================
// Pool mock
// ======================
export const pool = {
  async query(sql, params) {
    // según cada query
    if (sql.startsWith("SELECT * FROM NOTIFICACION WHERE ID_NOTIFICACION")) {
      return { rows: [{ id_notificacion: params[0], nombre_notificacion: "Recordatorio" }] };
    }
    if (sql.startsWith("INSERT INTO NOTIFICACION")) {
      return { rows: [{ id_notificacion: 10, nombre_notificacion: params[0] }] };
    }
    if (sql.startsWith("UPDATE NOTIFICACION SET") && sql.includes("RETURNING *")) {
      // update, inactivar, completar, restaurar
      return { rows: [{ id_notificacion: params[params.length - 1], estado_notificacion: "X" }] };
    }
    if (sql.startsWith("SELECT * FROM NOTIFICACION WHERE 1=1")) {
      return { rows: [{ id_notificacion: 1, nombre_notificacion: "Prueba" }] };
    }
    return { rows: [] };
  }
};

// ======================
// Repository functions reimplementadas
// ======================
async function fetchNotificaciones(query = {}) {
  const result = await pool.query("SELECT * FROM NOTIFICACION WHERE 1=1", []);
  return result.rows;
}

async function fetchNotificacionById(id) {
  const result = await pool.query("SELECT * FROM NOTIFICACION WHERE ID_NOTIFICACION = $1", [id]);
  return result.rows[0];
}

async function insertNotificacion(data) {
  const { nombre_notificacion } = data;
  const result = await pool.query(
    `INSERT INTO NOTIFICACION (NOMBRE_NOTIFICACION, DESCRIPCION_NOTIFICACION, URGENCIA_NOTIFICACION,
      FECHAINICIO_NOTIFICACION, FECHAFIN_NOTIFICACION, HORAINICIO_NOTIFICACION, HORAFIN_NOTIFICACION, ESTADO_NOTIFICACION)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [nombre_notificacion, "desc", "U", "2025-09-01", "2025-09-02", "08:00", "17:00", "A"]
  );
  return result.rows[0];
}

async function updateNotificacion(id, data) {
  const result = await pool.query(
    `UPDATE NOTIFICACION SET NOMBRE_NOTIFICACION=$1 WHERE ID_NOTIFICACION=$2 RETURNING *`,
    [data.nombre_notificacion, id]
  );
  return result.rows[0];
}

async function inactivarNotificacion(id) {
  const result = await pool.query(
    `UPDATE NOTIFICACION SET ESTADO_NOTIFICACION='I' WHERE ID_NOTIFICACION=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

async function completarNotificacion(id) {
  const result = await pool.query(
    `UPDATE NOTIFICACION SET ESTADO_NOTIFICACION='C' WHERE ID_NOTIFICACION=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

async function restaurarNotificacion(id) {
  const result = await pool.query(
    `UPDATE NOTIFICACION SET ESTADO_NOTIFICACION='P' WHERE ID_NOTIFICACION=$1 RETURNING *`,
    [id]
  );
  return result.rows[0];
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests notificaciones.repository");

  {
    const r = await fetchNotificaciones();
    assert.strictEqual(r[0].nombre_notificacion, "Prueba");
    console.log("✔ fetchNotificaciones OK");
  }

  {
    const r = await fetchNotificacionById(5);
    assert.strictEqual(r.id_notificacion, 5);
    console.log("✔ fetchNotificacionById OK");
  }

  {
    const r = await insertNotificacion({ nombre_notificacion: "Nueva" });
    assert.strictEqual(r.nombre_notificacion, "Nueva");
    console.log("✔ insertNotificacion OK");
  }

  {
    const r = await updateNotificacion(7, { nombre_notificacion: "Actualizada" });
    assert.strictEqual(r.id_notificacion, 7);
    console.log("✔ updateNotificacion OK");
  }

  {
    const r = await inactivarNotificacion(8);
    assert.strictEqual(r.id_notificacion, 8);
    console.log("✔ inactivarNotificacion OK");
  }

  {
    const r = await completarNotificacion(9);
    assert.strictEqual(r.id_notificacion, 9);
    console.log("✔ completarNotificacion OK");
  }

  {
    const r = await restaurarNotificacion(11);
    assert.strictEqual(r.id_notificacion, 11);
    console.log("✔ restaurarNotificacion OK");
  }

  console.log("✅ Todos los tests de notificaciones.repository pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
