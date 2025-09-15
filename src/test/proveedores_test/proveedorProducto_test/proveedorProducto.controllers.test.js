// tests_manual/proveedorProducto.controller.test.js
import assert from "assert";

// ======================
// Mock Service
// ======================
const ProveedorProductoService = {
  obtenerPorProducto: async (id_producto) => [
    { id_proveedor: 1, nombre_proveedor: "Prov A", id_producto },
  ],
  obtenerPorVariosProductos: async (ids) => [
    { id_producto: ids[0], id_proveedor: 2, nombre_proveedor: "Prov B" },
  ],
  obtenerPorProveedor: async (id) => [
    { id_producto: 10, nombre_producto: "Producto X", id_proveedor: id },
  ],
  asociarProveedor: async (data) => ({
    id_proveedorproducto: 99,
    ...data,
  }),
  desasociarProveedor: async (id) =>
    id === "404" ? null : { id_proveedorproducto: id, estado: "I" },
};

// ======================
// Controller fake con inyección del service
// ======================
const controller = {
  async getProveedoresByProducto(req, res) {
    try {
      const data = await ProveedorProductoService.obtenerPorProducto(req.params.id_producto);
      res.json(data);
    } catch {
      res.status(500).json({ error: "Error al obtener proveedores del producto" });
    }
  },
  async getProveedoresByMultipleProductos(req, res) {
    try {
      const data = await ProveedorProductoService.obtenerPorVariosProductos(req.query.ids);
      res.json(data);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async getProductosByProveedor(req, res) {
    try {
      const data = await ProveedorProductoService.obtenerPorProveedor(req.params.id);
      res.json(data);
    } catch {
      res.status(500).json({ error: "Error al obtener productos del proveedor" });
    }
  },
  async asociarProveedorAProducto(req, res) {
    try {
      const asociacion = await ProveedorProductoService.asociarProveedor(req.body);
      res.status(201).json(asociacion);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  async desasociarProveedorDeProducto(req, res) {
    try {
      const result = await ProveedorProductoService.desasociarProveedor(req.params.id_proveedorproducto);
      if (!result) return res.status(404).json({ error: "Asociación no encontrada" });
      res.json({ message: "Proveedor desasociado correctamente" });
    } catch {
      res.status(500).json({ error: "Error al desasociar proveedor del producto" });
    }
  },
};

// ======================
// Mock res
// ======================
function makeRes() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (c) {
    this.statusCode = c;
    return this;
  };
  res.json = function (d) {
    this.body = d;
    return this;
  };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests proveedorProducto.controller");

  // 1. getProveedoresByProducto
  {
    const res = makeRes();
    await controller.getProveedoresByProducto({ params: { id_producto: 5 } }, res);
    assert.strictEqual(res.body[0].id_producto, 5);
    console.log("✔ getProveedoresByProducto OK");
  }

  // 2. getProveedoresByMultipleProductos
  {
    const res = makeRes();
    await controller.getProveedoresByMultipleProductos({ query: { ids: [7, 8] } }, res);
    assert.strictEqual(res.body[0].id_producto, 7);
    console.log("✔ getProveedoresByMultipleProductos OK");
  }

  // 3. getProductosByProveedor
  {
    const res = makeRes();
    await controller.getProductosByProveedor({ params: { id: 12 } }, res);
    assert.strictEqual(res.body[0].id_proveedor, 12);
    console.log("✔ getProductosByProveedor OK");
  }

  // 4. asociarProveedorAProducto
  {
    const res = makeRes();
    await controller.asociarProveedorAProducto(
      { body: { id_proveedor_proveedorproducto: 1, id_producto_proveedorproducto: 2 } },
      res
    );
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.id_proveedor_proveedorproducto, 1);
    console.log("✔ asociarProveedorAProducto OK");
  }

  // 5. desasociarProveedorDeProducto OK
  {
    const res = makeRes();
    await controller.desasociarProveedorDeProducto({ params: { id_proveedorproducto: "55" } }, res);
    assert.strictEqual(res.body.message, "Proveedor desasociado correctamente");
    console.log("✔ desasociarProveedorDeProducto OK");
  }

  // 6. desasociarProveedorDeProducto 404
  {
    const res = makeRes();
    await controller.desasociarProveedorDeProducto({ params: { id_proveedorproducto: "404" } }, res);
    assert.strictEqual(res.statusCode, 404);
    assert.ok(res.body.error.includes("no encontrada"));
    console.log("✔ desasociarProveedorDeProducto 404 OK");
  }

  console.log("✅ Todos los tests de proveedorProducto.controller pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
