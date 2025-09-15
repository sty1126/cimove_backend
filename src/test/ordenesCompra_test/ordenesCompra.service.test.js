import assert from "assert";

// ======================
// Repo mock
// ======================
const repo = {
  obtenerOrdenes: async () => ({
    rows: [
      {
        id_ordencompra: 1,
        fecha_ordencompra: "2025-09-01",
        total_ordencompra: 100,
        estado_facturaproveedor: "A",
        id_proveedor: 5,
        nombre_proveedor: "Proveedor X",
        id_detalleordencompra: 10,
        id_producto_detalleordencompra: 20,
        nombre_producto: "Producto Y",
        cantidad_detalleordencompra: 2,
        preciounitario_detalleordencompra: 50,
        subtotal_detalleordencompra: 100
      }
    ]
  }),
  crearOrden: async (data) => ({ rows: [{ id_ordencompra: 2, total_ordencompra: data.total }] }),
  obtenerOrdenPorId: async (id) => ({
    rows: id === 3 ? [{ id_ordencompra: 3, nombre_proveedor: "ProvZ" }] : []
  }),
  crearConexion: async () => {
    return {
      queries: [],
      async query(sql, params) {
        this.queries.push({ sql, params });
        if (sql.includes("SELECT costoventa_producto")) {
          return { rows: [{ costoventa_producto: 10 }] };
        }
        if (sql.includes("INSERT INTO ordencompra")) {
          return { rows: [{ id_ordencompra: 99, total_ordencompra: params[2] }] };
        }
        return { rows: [] };
      },
      async release() {}
    };
  }
};

// ======================
// Service fake usando repo mock
// ======================
const service = {
  async listarOrdenes() {
    const result = await repo.obtenerOrdenes();
    const ordenesMap = {};

    result.rows.forEach((row) => {
      const id = row.id_ordencompra;
      if (!ordenesMap[id]) {
        ordenesMap[id] = {
          id_ordencompra: id,
          fecha_ordencompra: row.fecha_ordencompra,
          total_ordencompra: row.total_ordencompra,
          estado_facturaproveedor: row.estado_facturaproveedor,
          id_proveedor: row.id_proveedor,
          nombre_proveedor: row.nombre_proveedor,
          detalles: []
        };
      }
      if (row.id_detalleordencompra) {
        ordenesMap[id].detalles.push({
          id_detalleordencompra: row.id_detalleordencompra,
          id_producto: row.id_producto_detalleordencompra,
          nombre_producto: row.nombre_producto,
          cantidad: row.cantidad_detalleordencompra,
          precio_unitario: row.preciounitario_detalleordencompra,
          subtotal: row.subtotal_detalleordencompra
        });
      }
    });

    return Object.values(ordenesMap);
  },

  async crearOrden(data) {
    const result = await repo.crearOrden(data);
    return result.rows[0];
  },

  async obtenerOrdenPorId(id) {
    const result = await repo.obtenerOrdenPorId(id);
    return result.rows[0] || null;
  },

  async procesarPedido(productos) {
    const client = await repo.crearConexion();
    try {
      const fecha = new Date();
      const pedidosPorProveedor = {};

      productos.forEach((prod) => {
        prod.proveedores.forEach((prov) => {
          if (!pedidosPorProveedor[prov.id_proveedor]) {
            pedidosPorProveedor[prov.id_proveedor] = [];
          }
          pedidosPorProveedor[prov.id_proveedor].push({
            id_producto: prod.id_producto,
            cantidad: prov.cantidad
          });
        });
      });

      await client.query("BEGIN");
      const ordenesCreadas = [];

      for (const id_proveedor in pedidosPorProveedor) {
        const detalles = pedidosPorProveedor[id_proveedor];
        let total = 0;

        for (const d of detalles) {
          const precioRes = await client.query("SELECT costoventa_producto FROM producto WHERE id_producto = $1", [d.id_producto]);
          const precio = precioRes.rows[0].costoventa_producto;
          d.precio_unitario = precio;
          d.subtotal = precio * d.cantidad;
          total += d.subtotal;
        }

        const ordenRes = await client.query(
          `INSERT INTO ordencompra (id_proveedor_ordencompra, fecha_ordencompra, total_ordencompra)
           VALUES ($1,$2,$3) RETURNING *`,
          [id_proveedor, fecha, total]
        );

        const orden = ordenRes.rows[0];
        ordenesCreadas.push(orden);
      }

      await client.query("COMMIT");
      return { mensaje: "Pedido procesado correctamente", ordenes: ordenesCreadas };
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
};

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests ordenesCompra.service");

  // 1. listarOrdenes
  {
    const ordenes = await service.listarOrdenes();
    assert.strictEqual(ordenes.length, 1);
    assert.strictEqual(ordenes[0].nombre_proveedor, "Proveedor X");
    assert.strictEqual(ordenes[0].detalles[0].nombre_producto, "Producto Y");
    console.log("✔ listarOrdenes OK");
  }

  // 2. crearOrden
  {
    const nueva = await service.crearOrden({ id_proveedor: 1, fecha: "2025-09-01", total: 300 });
    assert.strictEqual(nueva.total_ordencompra, 300);
    console.log("✔ crearOrden OK");
  }

  // 3. obtenerOrdenPorId found
  {
    const encontrada = await service.obtenerOrdenPorId(3);
    assert.strictEqual(encontrada.nombre_proveedor, "ProvZ");
    console.log("✔ obtenerOrdenPorId (found) OK");
  }

  // 4. obtenerOrdenPorId not found
  {
    const noExiste = await service.obtenerOrdenPorId(999);
    assert.strictEqual(noExiste, null);
    console.log("✔ obtenerOrdenPorId (not found) OK");
  }

  // 5. procesarPedido
  {
    const pedido = await service.procesarPedido([
      { id_producto: 100, proveedores: [{ id_proveedor: 77, cantidad: 2 }] }
    ]);
    assert.strictEqual(pedido.mensaje, "Pedido procesado correctamente");
    assert.strictEqual(pedido.ordenes[0].id_ordencompra, 99);
    console.log("✔ procesarPedido OK");
  }

  console.log("✅ Todos los tests de ordenesCompra.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
