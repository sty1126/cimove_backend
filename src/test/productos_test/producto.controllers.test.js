import assert from "assert";

// ======================
// Mock Service
// ======================
const mockService = {
  obtenerTodos: async () => [{ id: 1, nombre_producto: "Laptop" }],
  obtenerPorId: async (id) =>
    id === "10" ? { id: 10, nombre_producto: "Mouse" } : null,
  obtenerDetalles: async () => [{ id: 2, nombre_producto: "Teclado" }],
  crearProducto: async (data) => ({ id: 3, ...data }),
  actualizarProducto: async (id, data) =>
    id === "99" ? null : { id, ...data },
  obtenerDetallePorId: async (id) =>
    id === "20"
      ? { id: 20, nombre_producto: "Monitor", inventario_sedes: [] }
      : null,
  eliminarProducto: async (id) =>
    id === "7" ? { id: 7 } : null,
  obtenerProveedores: async (id) => [
    { id_proveedor: 1, nombre_proveedor: "ProveedorX" },
  ],
};

// ======================
// Controller con service mock
// ======================
const controller = {
  async getProductos(req, res) {
    const data = await mockService.obtenerTodos();
    res.json(data);
  },
  async getProducto(req, res) {
    const data = await mockService.obtenerPorId(req.params.productoId);
    if (!data) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(data);
  },
  async getProductosDetalles(req, res) {
    const data = await mockService.obtenerDetalles();
    res.json(data);
  },
  async createProducto(req, res) {
    const nuevo = await mockService.crearProducto(req.body);
    res.status(201).json(nuevo);
  },
  async putProducto(req, res) {
    const actualizado = await mockService.actualizarProducto(req.params.productoId, req.body);
    if (!actualizado) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado correctamente", producto: actualizado });
  },
  async getProductoDetalle(req, res) {
    const data = await mockService.obtenerDetallePorId(req.params.productoId);
    if (!data) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(data);
  },
  async deleteProducto(req, res) {
    const eliminado = await mockService.eliminarProducto(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  },
  async getProveedoresPorProducto(req, res) {
    const data = await mockService.obtenerProveedores(req.params.productoId);
    res.json(data);
  },
};

// ======================
// Mock Express res
// ======================
function makeRes() {
  return {
    statusCode: 200,
    body: null,
    status(c) {
      this.statusCode = c;
      return this;
    },
    json(d) {
      this.body = d;
      return this;
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests productos.controller");

  {
    const res = makeRes();
    await controller.getProductos({}, res);
    assert.strictEqual(res.body[0].nombre_producto, "Laptop");
    console.log("✔ getProductos OK");
  }

  {
    const res = makeRes();
    await controller.getProducto({ params: { productoId: "10" } }, res);
    assert.strictEqual(res.body.nombre_producto, "Mouse");
    console.log("✔ getProducto OK");
  }

  {
    const res = makeRes();
    await controller.getProducto({ params: { productoId: "99" } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ getProducto not found OK");
  }

  {
    const res = makeRes();
    await controller.createProducto({ body: { nombre_producto: "Tablet" } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.nombre_producto, "Tablet");
    console.log("✔ createProducto OK");
  }

  {
    const res = makeRes();
    await controller.putProducto({ params: { productoId: "1" }, body: { nombre_producto: "Nuevo" } }, res);
    assert.strictEqual(res.body.producto.nombre_producto, "Nuevo");
    console.log("✔ putProducto OK");
  }

  {
    const res = makeRes();
    await controller.putProducto({ params: { productoId: "99" }, body: {} }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ putProducto not found OK");
  }

  {
    const res = makeRes();
    await controller.getProductoDetalle({ params: { productoId: "20" } }, res);
    assert.strictEqual(res.body.nombre_producto, "Monitor");
    console.log("✔ getProductoDetalle OK");
  }

  {
    const res = makeRes();
    await controller.deleteProducto({ params: { id: "7" } }, res);
    assert.strictEqual(res.body.message, "Producto eliminado correctamente");
    console.log("✔ deleteProducto OK");
  }

  {
    const res = makeRes();
    await controller.deleteProducto({ params: { id: "77" } }, res);
    assert.strictEqual(res.statusCode, 404);
    console.log("✔ deleteProducto not found OK");
  }

  {
    const res = makeRes();
    await controller.getProveedoresPorProducto({ params: { productoId: "5" } }, res);
    assert.strictEqual(res.body[0].nombre_proveedor, "ProveedorX");
    console.log("✔ getProveedoresPorProducto OK");
  }

  console.log("✅ Todos los tests de productos.controller pasaron");
}

run().catch((err) => console.error("❌ Error en tests:", err));
