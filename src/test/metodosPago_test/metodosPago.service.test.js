import assert from "assert";


const fakeRepo = {
  insertMetodoPago: async (_idFactura, idTipo, monto) => ({
    id: Math.random(),
    idTipo,
    monto
  }),
  fetchMetodosPagoByFacturaId: async (idFactura) => [{ idFactura, monto: 100 }],
  fetchAllActiveMetodosPago: async () => [{ id: 1, nombre: "Efectivo" }],
  deactivateMetodoPagoById: async (id) => (id === 1 ? { id, estado: "I" } : null)
};


async function addMetodosPagoToFactura(idFactura, metodosPago) {
  if (!Array.isArray(metodosPago) || metodosPago.length === 0) {
    throw new Error("Se requiere al menos un método de pago.");
  }
  const addedMethods = [];
  for (const pago of metodosPago) {
    if (!pago.idTipoMetodoPago || pago.monto == null) {
      throw new Error("Cada método de pago debe tener idTipoMetodoPago y monto.");
    }
    const newMetodo = await fakeRepo.insertMetodoPago(idFactura, pago.idTipoMetodoPago, pago.monto);
    addedMethods.push(newMetodo);
  }
  return { mensaje: "Métodos de pago agregados con éxito", addedMethods };
}

const getMetodosPagoByFactura = async (idFactura) => fakeRepo.fetchMetodosPagoByFacturaId(idFactura);
const getAllMetodosPago = async () => fakeRepo.fetchAllActiveMetodosPago();
const annulMetodoPago = async (idMetodoPago) => {
  const deactivated = await fakeRepo.deactivateMetodoPagoById(idMetodoPago);
  if (!deactivated) throw new Error("Método de pago no encontrado o ya inactivo.");
  return { mensaje: "Método de pago anulado con éxito", metodoAnulado: deactivated };
};

// Tests
async function run() {
  console.log("▶ Tests metodosPago.service");

  {
    const r = await addMetodosPagoToFactura(1, [{ idTipoMetodoPago: 2, monto: 500 }]);
    assert.strictEqual(r.addedMethods.length, 1);
    console.log("✔ addMetodosPagoToFactura OK");
  }

  try {
    await addMetodosPagoToFactura(1, []);
    console.error("❌ addMetodosPagoToFactura debería fallar por vacío");
  } catch (e) {
    console.log("✔ addMetodosPagoToFactura vacío OK");
  }

  {
    const r = await getMetodosPagoByFactura(10);
    assert.strictEqual(r[0].idFactura, 10);
    console.log("✔ getMetodosPagoByFactura OK");
  }

  {
    const r = await getAllMetodosPago();
    assert.strictEqual(r[0].nombre, "Efectivo");
    console.log("✔ getAllMetodosPago OK");
  }

  {
    const r = await annulMetodoPago(1);
    assert.strictEqual(r.metodoAnulado.estado, "I");
    console.log("✔ annulMetodoPago OK");
  }

  try {
    await annulMetodoPago(999);
    console.error("❌ annulMetodoPago debería fallar con id inválido");
  } catch (e) {
    console.log("✔ annulMetodoPago Not Found OK");
  }

  console.log("✅ Todos los tests de metodosPago.service pasaron");
}

run().catch(err => console.error("❌ Error en tests:", err));
