import assert from "assert";

// ======================
// Repo mock
// ======================
const repo = {
  obtenerTodos: async () => ({ rows: [{ id: 1, nombre_producto: "Laptop" }] }),
  obtenerPorId: async (id) =>
    id === 10 ? { rows: [{ id: 10, nombre_producto: "Mouse" }] } : { rows: [] },
  obtenerDetalles: async () => ({ rows: [{ id: 2, nombre_producto: "Teclado" }] }),
  crearProducto: async (data) => ({ rows: [{ id: 3, ...data }] }),
  actualizarProducto: async (id, data) => ({ rows: [{ id, ...data }] }),
  obtenerDetallePorId: async (id) =>
    id === 20
      ? [
          { rows: [{ id: 20, nombre_producto: "Monitor" }] },
          { rows: [{ id_sede: 1, stock: 50 }] },
        ]
      : [{ rows: [] }, { rows: [] }],
  eliminarProducto: async (id) =>
    id === 7 ? { rows: [{ id: 7 }] } : { rows: [] },
  obtenerProveedoresPorProducto: async (id) => ({
    rows: [{ id_proveedor: 1, nombre_proveedor: "ProveedorX" }],
  }),
};

// ======================
// Service usando repo mock
// ======================
const service = {
  async obtenerTodos() {
    const { rows } = await repo.obtenerTodos();
    return rows;
  },
  async obtenerPorId(id) {
    const { rows } = await repo.obtenerPorId(id);
    return rows[0] || null;
  },
  async obtenerDetalles() {
    const { rows } = await repo.obtenerDetalles();
    return rows;
  },
  async crearProducto(data) {
    const { rows } = await repo.crearProducto(data);
    return rows[0];
  },
  async actualizarProducto(id, data) {
    const actual = await this.obtenerPorId(id);
    if (!actual) return null;
    const { rows } = await repo.actualizarProducto(id, { ...actual, ...data });
    return rows[0];
  },
  async obtenerDetallePorId(id) {
    const [productoRes, inventarioRes] = await repo.obtenerDetallePorId(id);
    if (productoRes.rows.length === 0) return null;
    const producto = productoRes.rows[0];
    producto.inventario_sedes = inventarioRes.rows;
    return producto;
  },
  async eliminarProducto(id) {
    const { rows } = await repo.eliminarProducto(id);
    return rows[0] || null;
  },
  async obtenerProveedores(id) {
    const { rows } = await repo.obtenerProveedoresPorProducto(id);
    return rows;
  },
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests productos.service");

  {
    const r = await service.obtenerTodos();
    assert.strictEqual(r[0].nombre_producto, "Laptop");
    console.log("✔ obtenerTodos OK");
  }

  {
    const r = await service.obtenerPorId(10);
    assert.strictEqual(r.nombre_producto, "Mouse");
    console.log("✔ obtenerPorId OK");
  }

  {
    const r = await service.obtenerPorId(999);
    assert.strictEqual(r, null);
    console.log("✔ obtenerPorId null OK");
  }

  {
    const r = await service.crearProducto({ nombre_producto: "Tablet" });
    assert.strictEqual(r.nombre_producto, "Tablet");
    console.log("✔ crearProducto OK");
  }

  {
    const r = await service.actualizarProducto(10, { nombre_producto: "Nuevo Mouse" });
    assert.strictEqual(r.nombre_producto, "Nuevo Mouse");
    console.log("✔ actualizarProducto OK");
  }

  {
    const r = await service.actualizarProducto(999, { nombre_producto: "Inexistente" });
    assert.strictEqual(r, null);
    console.log("✔ actualizarProducto null OK");
  }

  {
    const r = await service.obtenerDetallePorId(20);
    assert.strictEqual(r.inventario_sedes[0].stock, 50);
    console.log("✔ obtenerDetallePorId OK");
  }

  {
    const r = await service.obtenerDetallePorId(99);
    assert.strictEqual(r, null);
    console.log("✔ obtenerDetallePorId null OK");
  }

  {
    const r = await service.eliminarProducto(7);
    assert.strictEqual(r.id, 7);
    console.log("✔ eliminarProducto OK");
  }

  {
    const r = await service.eliminarProducto(77);
    assert.strictEqual(r, null);
    console.log("✔ eliminarProducto null OK");
  }

  {
    const r = await service.obtenerProveedores(5);
    assert.strictEqual(r[0].nombre_proveedor, "ProveedorX");
    console.log("✔ obtenerProveedores OK");
  }

  console.log("✅ Todos los tests de productos.service pasaron");
}

run().catch((err) => console.error("❌ Error en tests:", err));
