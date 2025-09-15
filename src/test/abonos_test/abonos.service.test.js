import assert from "assert";

// Simulación del repo
const mockRepo = {
  insertarAbono: async (idFactura, fecha, monto) =>
    ({ id_abonofactura: 1, idFactura, fecha, monto, estado: "A" }),
  anularAbonoPorId: async (id) =>
    id === 999 ? null : ({ id_abonofactura: id, estado_abonofactura: "I" }),
};

// Servicios reducidos con DI (inyección de dependencias)
const createAbono = (repo) => async (data) => {
  const { id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura } = data;
  if (!id_facturaproveedor_abonofactura || !fecha_abonofactura || !monto_abonofactura) {
    throw new Error("Todos los campos son obligatorios");
  }
  if (isNaN(Number(monto_abonofactura))) throw new Error("Monto inválido");
  return await repo.insertarAbono(id_facturaproveedor_abonofactura, fecha_abonofactura, monto_abonofactura);
};

const anularAbono = (repo) => async (id) => {
  const r = await repo.anularAbonoPorId(id);
  if (!r) throw new Error("Abono no encontrado");
  return { mensaje: "Abono anulado correctamente", abono: r };
};

async function run() {
  console.log("▶ Tests service_abonos");

  // 1. Creación exitosa
  {
    const svc = createAbono(mockRepo);
    const abono = await svc({ id_facturaproveedor_abonofactura: 1, fecha_abonofactura: "2025-09-13", monto_abonofactura: 500 });
    assert.strictEqual(abono.estado, "A");
  }

  // 2. Campos faltantes
  {
    const svc = createAbono(mockRepo);
    let err;
    try {
      await svc({ fecha_abonofactura: "2025-09-13", monto_abonofactura: 100 });
    } catch (e) { err = e; }
    assert.strictEqual(err.message, "Todos los campos son obligatorios");
  }

  // 3. Monto inválido
  {
    const svc = createAbono(mockRepo);
    let err;
    try {
      await svc({ id_facturaproveedor_abonofactura: 1, fecha_abonofactura: "2025-09-13", monto_abonofactura: "abc" });
    } catch (e) { err = e; }
    assert.strictEqual(err.message, "Monto inválido");
  }

  // 4. Anular abono válido
  {
    const svc = anularAbono(mockRepo);
    const res = await svc(5);
    assert.strictEqual(res.abono.estado_abonofactura, "I");
  }

  // 5. Anular abono inexistente
  {
    const svc = anularAbono(mockRepo);
    let err;
    try {
      await svc(999);
    } catch (e) { err = e; }
    assert.strictEqual(err.message, "Abono no encontrado");
  }

  console.log("✔ service_abonos OK");
}
run();