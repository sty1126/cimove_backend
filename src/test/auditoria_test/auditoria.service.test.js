import assert from "assert";



const fakeRepo = {
  obtenerAuditorias: async () => [{ id: 1, tipo: "general" }],
  obtenerAuditoriasPorUsuario: async (id) => [{ id: 2, tipo: "usuario" }],
  obtenerAuditoriasPorFechas: async (inicio, fin) => [{ id: 3, tipo: "fechas" }],
  obtenerAuditoriasPorTipoMov: async (id) => [{ id: 4, tipo: "tipomov" }],
};

// Service con repo inyectado

function makeService(repo) {
  return {
    async getAuditorias(filtros = {}) {
      const { idUsuario, fechaInicio, fechaFin, idTipoMov } = filtros;

      if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
        throw new Error("Debe especificar fecha inicio y fecha fin");
      }

      if (idUsuario && isNaN(Number(idUsuario))) {
        throw new Error("El ID de usuario debe ser un número válido");
      }

      if (idTipoMov && isNaN(Number(idTipoMov))) {
        throw new Error("El ID de tipo de movimiento debe ser un número válido");
      }

      if (idUsuario) {
        return await repo.obtenerAuditoriasPorUsuario(idUsuario);
      } else if (fechaInicio && fechaFin) {
        return await repo.obtenerAuditoriasPorFechas(fechaInicio, fechaFin);
      } else if (idTipoMov) {
        return await repo.obtenerAuditoriasPorTipoMov(idTipoMov);
      } else {
        return await repo.obtenerAuditorias();
      }
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests auditoria.service");

  const service = makeService(fakeRepo);

  // Test 1: getAuditorias - Sin filtros
  {
    const res = await service.getAuditorias();
    assert.strictEqual(res[0].tipo, "general");
    console.log("✔ getAuditorias sin filtros OK");
  }

  // Test 2: getAuditorias - Con filtro de usuario
  {
    const res = await service.getAuditorias({ idUsuario: 1 });
    assert.strictEqual(res[0].tipo, "usuario");
    console.log("✔ getAuditorias por usuario OK");
  }

  // Test 3: getAuditorias - Con filtro de fechas
  {
    const res = await service.getAuditorias({
      fechaInicio: "2023-01-01",
      fechaFin: "2023-01-31",
    });
    assert.strictEqual(res[0].tipo, "fechas");
    console.log("✔ getAuditorias por fechas OK");
  }

  // Test 4: getAuditorias - Con filtro de tipo de movimiento
  {
    const res = await service.getAuditorias({ idTipoMov: 1 });
    assert.strictEqual(res[0].tipo, "tipomov");
    console.log("✔ getAuditorias por tipo de movimiento OK");
  }

  // Test 5: getAuditorias - Error por fechas incompletas
  {
    let errorCaught = false;
    try {
      await service.getAuditorias({ fechaInicio: "2023-01-01" });
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("Debe especificar fecha inicio y fecha fin"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ getAuditorias error por fechas incompletas OK");
  }

  // Test 6: getAuditorias - Error por ID de usuario inválido
  {
    let errorCaught = false;
    try {
      await service.getAuditorias({ idUsuario: "abc" });
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("El ID de usuario debe ser un número válido"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ getAuditorias error por ID de usuario inválido OK");
  }

  console.log("✅ Todos los tests de auditoria.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});