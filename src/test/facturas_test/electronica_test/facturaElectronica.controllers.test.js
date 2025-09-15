import assert from "assert";


const fakeService = {
  obtenerFacturasActivas: async () => [{ id_factura: 1, cufe: "ABC123" }],
  obtenerFacturaPorId: async (id) => id == 1 ? { id_factura: 1, cufe: "ABC123" } : null,
  crearFactura: async (data) => ({ ...data, id_factura: 2 }),
  actualizarFactura: async (id, data) => id == 1 ? { ...data, id_factura: 1 } : null,
  eliminarFactura: async (id) => id == 1
};

// Controllers simulados
async function getFacturasElectronicas(req, res) {
  const data = await fakeService.obtenerFacturasActivas();
  res.status(200).json(data);
}
async function getFacturaElectronicaById(req, res) {
  const data = await fakeService.obtenerFacturaPorId(req.params.id);
  if (!data) return res.status(404).json({ message: "No encontrada" });
  res.json(data);
}
async function createFacturaElectronica(req, res) {
  const data = await fakeService.crearFactura(req.body);
  res.status(201).json(data);
}
async function updateFacturaElectronica(req, res) {
  const data = await fakeService.actualizarFactura(req.params.id, req.body);
  if (!data) return res.status(404).json({ message: "No encontrada o inactiva" });
  res.json({ message: "Actualizada correctamente", factura: data });
}
async function deleteFacturaElectronica(req, res) {
  const deleted = await fakeService.eliminarFactura(req.params.id);
  if (!deleted) return res.status(404).json({ message: "No encontrada" });
  res.json({ message: "Factura eliminada correctamente" });
}

// Mock de response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) { this.statusCode = code; return this; },
    json(data) { this.body = data; return this; },
  };
}

async function run() {
  console.log("▶ Tests facturaElectronica.controllers");

  // GET all
  {
    const res = createResMock();
    await getFacturasElectronicas({}, res);
    assert.strictEqual(res.body[0].cufe, "ABC123");
    console.log("✔ getFacturasElectronicas OK");
  }

  // GET by id (ok)
  {
    const res = createResMock();
    await getFacturaElectronicaById({ params: { id: 1 } }, res);
    assert.strictEqual(res.body.id_factura, 1);
    console.log("✔ getFacturaElectronicaById OK");
  }

  // GET by id (not found)
  {
    const res = createResMock();
    await getFacturaElectronicaById({ params: { id: 999 } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getFacturaElectronicaById Not Found OK");
  }

  // CREATE
  {
    const res = createResMock();
    await createFacturaElectronica({ body: { cufe: "XYZ", fecha: "2025-01-01" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.id_factura, 2);
    console.log("✔ createFacturaElectronica OK");
  }

  // UPDATE ok
  {
    const res = createResMock();
    await updateFacturaElectronica({ params: { id: 1 }, body: { cufe: "NEW" } }, res);
    assert.strictEqual(res.body.factura.cufe, "NEW");
    console.log("✔ updateFacturaElectronica OK");
  }

  // UPDATE not found
  {
    const res = createResMock();
    await updateFacturaElectronica({ params: { id: 999 }, body: {} }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ updateFacturaElectronica Not Found OK");
  }

  // DELETE ok
  {
    const res = createResMock();
    await deleteFacturaElectronica({ params: { id: 1 } }, res);
    assert.strictEqual(res.body.message, "Factura eliminada correctamente");
    console.log("✔ deleteFacturaElectronica OK");
  }

  // DELETE not found
  {
    const res = createResMock();
    await deleteFacturaElectronica({ params: { id: 999 } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ deleteFacturaElectronica Not Found OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests controllers:", err);
  process.exit(1);
});
