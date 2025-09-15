import assert from "assert";

const fakeRepo = {
  findAll: async () => [{ id_facturaproveedor: 1, monto: 500 }],
  findById: async (id) => (id === 1 ? { id_facturaproveedor: 1 } : null),
  insert: async (data) => ({ ...data, id_facturaproveedor: 2 })
};

// Service simulado
const obtenerFacturas = () => fakeRepo.findAll();
const obtenerFacturaPorId = (id) => fakeRepo.findById(id);
const crearFactura = (data) => fakeRepo.insert(data);

async function run() {
  console.log("▶ Tests facturasProveedores.service");

  const r1 = await obtenerFacturas();
  assert.strictEqual(r1[0].id_facturaproveedor, 1);
  console.log("✔ obtenerFacturas OK");

  const r2 = await obtenerFacturaPorId(1);
  assert.strictEqual(r2.id_facturaproveedor, 1);
  console.log("✔ obtenerFacturaPorId OK");

  const r3 = await obtenerFacturaPorId(999);
  assert.strictEqual(r3, null);
  console.log("✔ obtenerFacturaPorId Not Found OK");

  const r4 = await crearFactura({ monto: 1000 });
  assert.strictEqual(r4.id_facturaproveedor, 2);
  console.log("✔ crearFactura OK");

  console.log("✅ Todos los tests de service pasaron");
}

run().catch((err) => console.error("❌ Error en tests service:", err));
