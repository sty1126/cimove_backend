
import assert from "assert";


function makeRepoMock() {
  return {
    obtenerPorProducto: async (id_producto) => ({
      rows: [
        { id_proveedorproducto: 1, nombre_proveedor: "Proveedor A" },
        { id_proveedorproducto: 2, nombre_proveedor: "Proveedor B" },
      ],
    }),
    obtenerPorVariosProductos: async (idList) => ({
      rows: [
        { id_producto: idList[0], nombre_proveedor: "Proveedor A" },
        { id_producto: idList[1], nombre_proveedor: "Proveedor C" },
      ],
    }),
    obtenerPorProveedor: async (id_proveedor) => ({
      rows: [
        { id_producto: 201, nombre_producto: "Producto X" },
        { id_producto: 202, nombre_producto: "Producto Y" },
      ],
    }),
    asociarProveedorAProducto: async (data) => ({
      rows: [{
        id_proveedorproducto: 99,
        id_proveedor_proveedorproducto: data.id_proveedor_proveedorproducto,
        id_producto_proveedorproducto: data.id_producto_proveedorproducto,
        estado_proveedorproducto: 'A',
      }],
    }),
    desasociarProveedor: async (id) => {
      // Simula el caso donde el ID existe
      if (id === 1) {
        return {
          rows: [{ id_proveedorproducto: id, estado_proveedorproducto: "I" }],
        };
      }
      // Simula el caso donde el ID no existe
      return { rows: [] };
    },
  };
}

// ======================
// Service con repo inyectado
// ======================
function makeService(repo) {
  return {
    async obtenerPorProducto(id_producto) {
      const { rows } = await repo.obtenerPorProducto(id_producto);
      return rows;
    },

    async obtenerPorVariosProductos(idsQuery) {
      if (!idsQuery) throw new Error("Faltan los IDs de producto");

      const idList = idsQuery
        .split(",")
        .map((id) => parseInt(id))
        .filter((id) => !isNaN(id));

      if (idList.length === 0) throw new Error("IDs de producto inválidos");

      const { rows } = await repo.obtenerPorVariosProductos(idList);
      return rows;
    },

    async obtenerPorProveedor(id_proveedor) {
      const { rows } = await repo.obtenerPorProveedor(id_proveedor);
      return rows;
    },

    async asociarProveedor(data) {
      if (!data.id_proveedor_proveedorproducto || !data.id_producto_proveedorproducto) {
        throw new Error("Faltan datos requeridos");
      }

      const { rows } = await repo.asociarProveedorAProducto(data);
      return rows[0];
    },

    async desasociarProveedor(id) {
      const { rows } = await repo.desasociarProveedor(id);
      if (rows.length === 0) return null;
      return rows[0];
    },
  };
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests proveedorproducto.service");

  const repo = makeRepoMock();
  const service = makeService(repo);

  // 1. obtenerPorProducto
  {
    const res = await service.obtenerPorProducto(1);
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre_proveedor, "Proveedor A");
    console.log("✔ obtenerPorProducto OK");
  }

  // 2. obtenerPorVariosProductos - Caso válido
  {
    const res = await service.obtenerPorVariosProductos("1,2");
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].id_producto, 1);
    console.log("✔ obtenerPorVariosProductos válido OK");
  }

  // 3. obtenerPorVariosProductos - Caso inválido (IDs faltantes)
  {
    let errorCaught = false;
    try {
      await service.obtenerPorVariosProductos();
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("Faltan los IDs"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ obtenerPorVariosProductos IDs faltantes error OK");
  }

  // 4. obtenerPorVariosProductos - Caso inválido (IDs mal formados)
  {
    let errorCaught = false;
    try {
      await service.obtenerPorVariosProductos("a,b,c");
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("IDs de producto inválidos"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ obtenerPorVariosProductos IDs inválidos error OK");
  }

  // 5. obtenerPorProveedor
  {
    const res = await service.obtenerPorProveedor(101);
    assert.strictEqual(res.length, 2);
    assert.strictEqual(res[0].nombre_producto, "Producto X");
    console.log("✔ obtenerPorProveedor OK");
  }

  // 6. asociarProveedor - Caso válido
  {
    const data = { id_proveedor_proveedorproducto: 1, id_producto_proveedorproducto: 10 };
    const res = await service.asociarProveedor(data);
    assert.strictEqual(res.estado_proveedorproducto, "A");
    assert.strictEqual(res.id_proveedor_proveedorproducto, 1);
    console.log("✔ asociarProveedor válido OK");
  }

  // 7. asociarProveedor - Caso inválido (datos faltantes)
  {
    let errorCaught = false;
    try {
      await service.asociarProveedor({});
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("Faltan datos requeridos"));
    }
    assert.strictEqual(errorCaught, true);
    console.log("✔ asociarProveedor datos faltantes error OK");
  }

  // 8. desasociarProveedor - Caso válido
  {
    const res = await service.desasociarProveedor(1);
    assert.strictEqual(res.estado_proveedorproducto, "I");
    console.log("✔ desasociarProveedor OK");
  }

  // 9. desasociarProveedor - Caso donde no se encuentra el ID
  {
    const res = await service.desasociarProveedor(999);
    assert.strictEqual(res, null);
    console.log("✔ desasociarProveedor ID no encontrado OK");
  }

  console.log("✅ Todos los tests de proveedorproducto.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});