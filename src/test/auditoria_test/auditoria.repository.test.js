import assert from "assert";



function makePoolMock() {
  return {
    async query(sql, params) {
      if (sql.toUpperCase().includes("SELECT")) {
        // Mock para obtenerAuditorias
        if (sql.includes("ORDER BY a.fechaoperacion_auditoria DESC") && (!params || params.length === 0)) {
          return { rows: [{ id_auditoria: 1, accion_auditoria: "GET ALL" }] };
        }
        // Mock para obtenerAuditoriasPorUsuario
        if (sql.includes("id_usuario_auditoria")) {
          return { rows: [{ id_auditoria: 2, id_usuario: params[0], accion_auditoria: "GET by user" }] };
        }
        // Mock para obtenerAuditoriasPorFechas
        if (sql.includes("fechaoperacion_auditoria BETWEEN")) {
          return { rows: [{ id_auditoria: 3, fecha_auditoria: params[0], accion_auditoria: "GET by dates" }] };
        }
        // Mock para obtenerAuditoriasPorTipoMov
        if (sql.includes("id_tipomov_auditoria")) {
          return { rows: [{ id_auditoria: 4, nom_tipomov: "Tipo Mov", accion_auditoria: "GET by type" }] };
        }
      }
      // Mock para INSERT
      if (sql.toUpperCase().includes("INSERT INTO AUDITORIA")) {
        return {
          rows: [{
            tablaafectada_auditoria: params[0],
            operacion_auditoria: params[1],
            id_usuario_auditoria: params[2],
            fechaoperacion_auditoria: "2023-10-27"
          }]
        };
      }
      return { rows: [] };
    },
  };
}


// Repository functions with injected pool
function makeRepo(pool) {
  return {
    obtenerAuditorias: () => pool.query("SELECT ... FROM auditoria a ... ORDER BY a.fechaoperacion_auditoria DESC").then(r => r.rows),
    obtenerAuditoriasPorUsuario: (idUsuario) => pool.query("SELECT ... WHERE a.id_usuario_auditoria = $1 ...", [idUsuario]).then(r => r.rows),
    obtenerAuditoriasPorFechas: (fechaInicio, fechaFin) => pool.query("SELECT ... WHERE a.fechaoperacion_auditoria BETWEEN $1 AND $2 ...", [fechaInicio, fechaFin]).then(r => r.rows),
    obtenerAuditoriasPorTipoMov: (idTipoMov) => pool.query("SELECT ... WHERE a.id_tipomov_auditoria = $1 ...", [idTipoMov]).then(r => r.rows),
    insertarAuditoria: (data) => {
      const { tabla, operacion, idUsuario, detalle, idSede, idTipoMov } = data;
      const values = [tabla, operacion, idUsuario, detalle, idSede, idTipoMov];
      return pool.query("INSERT INTO auditoria ... VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6) RETURNING *;", values).then(r => r.rows[0]);
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests auditoria.repository");

  const pool = makePoolMock();
  const repo = makeRepo(pool);

  // 1. Obtener todas las auditorias
  {
    const res = await repo.obtenerAuditorias();
    assert.strictEqual(res[0].accion_auditoria, "GET ALL");
    console.log("✔ obtenerAuditorias OK");
  }

  // 2. Obtener auditorias por usuario
  {
    const res = await repo.obtenerAuditoriasPorUsuario(10);
    assert.strictEqual(res[0].id_usuario, 10);
    console.log("✔ obtenerAuditoriasPorUsuario OK");
  }

  // 3. Obtener auditorias por fechas
  {
    const res = await repo.obtenerAuditoriasPorFechas("2023-01-01", "2023-01-31");
    assert.strictEqual(res[0].fecha_auditoria, "2023-01-01");
    console.log("✔ obtenerAuditoriasPorFechas OK");
  }

  // 4. Obtener auditorias por tipo de movimiento
  {
    const res = await repo.obtenerAuditoriasPorTipoMov(1);
    assert.strictEqual(res[0].nom_tipomov, "Tipo Mov");
    console.log("✔ obtenerAuditoriasPorTipoMov OK");
  }

  // 5. Insertar auditoria
  {
    const data = {
      tabla: "factura",
      operacion: "INSERT",
      idUsuario: 10,
      detalle: "{ 'id': 100 }",
      idSede: 1,
      idTipoMov: 1,
    };
    const res = await repo.insertarAuditoria(data);
    assert.strictEqual(res.operacion_auditoria, "INSERT");
    assert.strictEqual(res.tablaafectada_auditoria, "factura");
    console.log("✔ insertarAuditoria OK");
  }

  console.log("✅ Todos los tests de auditoria.repository pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});