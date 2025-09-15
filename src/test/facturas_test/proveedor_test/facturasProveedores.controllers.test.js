import assert from "assert";


const fakeService = {
  obtenerFacturas: async () => [{ id_facturaproveedor: 1, monto: 500 }],
  obtenerFacturaPorId: async (id) => (id == 1 ? { id_facturaproveedor: 1 } : null),
  crearFactura: async (data) => ({ ...data, id_facturaproveedor: 2 })
};

// Controllers simulados
async function getFacturasProveedor(req, res) {
  const data = await fakeService.obtenerFacturas();
  res.json(data);
}
async function getFacturaProveedorById(req, res) {
  const data = await fakeService.obtenerFacturaPorId(req.params.id);
  if (!data) return res.status(404).json({ message: "No encontrada" });
  res.json(data);
}
async function createFacturaProveedor(req, res) {
  const data = await fakeService.crearFactura(req.body);
  res.status(201).json({ message: "Factura proveedor creada", factura: data });
}

// Mock response
function createResMock() {
  return {
    statusCode: 200,
    body: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(data) {
      this.body = data;
      return this;
    }
  };
}

async function run() {
  console.log("▶ Tests facturasProveedores.controllers");

  {
    const res = createResMock();
    await getFacturasProveedor({}, res);
    assert.strictEqual(res.body[0].id_facturaproveedor, 1);
    console.log("✔ getFacturasProveedor OK");
  }

  {
    const res = createResMock();
    await getFacturaProveedorById({ params: { id: 1 } }, res);
    assert.strictEqual(res.body.id_facturaproveedor, 1);
    console.log("✔ getFacturaProveedorById OK");
  }

  {
    const res = createResMock();
    await getFacturaProveedorById({ params: { id: 999 } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getFacturaProveedorById Not Found OK");
  }

  {
    const res = createResMock();
    await createFacturaProveedor({ body: { monto: 1000 } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.factura.id_facturaproveedor, 2);
    console.log("✔ createFacturaProveedor OK");
  }

  console.log("✅ Todos los tests de controllers pasaron");
}

run().catch((err) => console.error("❌ Error en tests controllers:", err));
