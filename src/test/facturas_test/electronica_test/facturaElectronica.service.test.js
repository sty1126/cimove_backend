import assert from "assert";


const fakeRepository = {
  findAllActivas: async () => [{ id_factura: 1, cufe: "ABC" }],
  findById: async (id) => (id == 1 ? { id_factura: 1 } : null),
  insert: async (data) => ({ ...data, id_factura: 2 }),
  update: async (id, data) => (id == 1 ? { ...data, id_factura: 1 } : null),
  softDelete: async (id) => id == 1
};

// Service simulado
const obtenerFacturasActivas = () => fakeRepository.findAllActivas();
const obtenerFacturaPorId = (id) => fakeRepository.findById(id);
const crearFactura = (data) => fakeRepository.insert(data);
const actualizarFactura = (id, data) => fakeRepository.update(id, data);
const eliminarFactura = (id) => fakeRepository.softDelete(id);

async function run() {
  console.log("▶ Tests facturaElectronica.service");

  const r1 = await obtenerFacturasActivas();
  assert.strictEqual(r1[0].cufe, "ABC");
  console.log("✔ obtenerFacturasActivas OK");

  const r2 = await obtenerFacturaPorId(1);
  assert.strictEqual(r2.id_factura, 1);
  console.log("✔ obtenerFacturaPorId OK");

  const r3 = await obtenerFacturaPorId(999);
  assert.strictEqual(r3, null);
  console.log("✔ obtenerFacturaPorId Not Found OK");

  const r4 = await crearFactura({ cufe: "XYZ" });
  assert.strictEqual(r4.id_factura, 2);
  console.log("✔ crearFactura OK");

  const r5 = await actualizarFactura(1, { cufe: "NEW" });
  assert.strictEqual(r5.id_factura, 1);
  console.log("✔ actualizarFactura OK");

  const r6 = await actualizarFactura(999, {});
  assert.strictEqual(r6, null);
  console.log("✔ actualizarFactura Not Found OK");

  const r7 = await eliminarFactura(1);
  assert.strictEqual(r7, true);
  console.log("✔ eliminarFactura OK");

  const r8 = await eliminarFactura(999);
  assert.strictEqual(r8, false);
  console.log("✔ eliminarFactura Not Found OK");

  console.log("✅ Todos los tests de service pasaron");
}

run().catch((err) => console.error("❌ Error en tests service:", err));
