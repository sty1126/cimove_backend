import assert from "assert";

const fakeRepo = {
  // Simula la obtención de tipos de proveedor
  obtenerTiposProveedor: async () => [
    { id_tipoproveedor: 1, nombre_tipoproveedor: "Fabricante" },
    { id_tipoproveedor: 2, nombre_tipoproveedor: "Distribuidor" },
  ],
  // Simula la inserción de un nuevo tipo de proveedor
  insertarTipoProveedor: async (nombre) => {
    // Devuelve un objeto simulado del tipo de proveedor insertado
    return { id_tipoproveedor: 3, nombre_tipoproveedor: nombre, estado_tipoproveedor: 'A' };
  },
};


function makeService(repo) {
  return {
    // Obtiene los tipos de proveedor llamando a la función del repo
    getTiposProveedor: async () => await repo.obtenerTiposProveedor(),

    // Crea un nuevo tipo de proveedor, validando que el nombre no esté vacío
    createTipoProveedor: async ({ nombre_tipoproveedor }) => {
      if (!nombre_tipoproveedor) {
        throw new Error("El nombre del tipo de proveedor es obligatorio"); // Lanza error si el nombre está vacío
      }
      return await repo.insertarTipoProveedor(nombre_tipoproveedor); // Llama al repo para insertar
    },
  };
}


async function run() {
  console.log("▶ Tests tiposProveedor.service");

  const service = makeService(fakeRepo); // Crea el servicio con el repo simulado

  // Test 1: getTiposProveedor
  // Verifica que el servicio retorna los tipos de proveedor del repo simulado
  {
    const res = await service.getTiposProveedor();
    assert.strictEqual(res.length, 2); // Espera 2 tipos de proveedor
    assert.strictEqual(res[0].nombre_tipoproveedor, "Fabricante"); // Verifica el nombre del primer tipo
    console.log("✔ getTiposProveedor OK");
  }

  // Test 2: createTipoProveedor - Caso válido
  // Verifica que la creación de un tipo de proveedor con nombre válido funciona
  {
    const nuevoTipo = await service.createTipoProveedor({ nombre_tipoproveedor: "Mayorista" });
    assert.strictEqual(nuevoTipo.nombre_tipoproveedor, "Mayorista"); // Verifica que el nombre es correcto
    assert.strictEqual(nuevoTipo.id_tipoproveedor, 3); 
    console.log("✔ createTipoProveedor válido OK");
  }

  // Test 3: createTipoProveedor - Caso inválido
  // Verifica que se lanza un error si el nombre del tipo de proveedor está ausente
  {
    let errorCaught = false;
    try {
      await service.createTipoProveedor({}); // Intenta crear sin nombre
    } catch (err) {
      errorCaught = true;
      assert.ok(err.message.includes("obligatorio")); // Verifica que el mensaje de error es el esperado
    }
    assert.strictEqual(errorCaught, true); 
    console.log("✔ createTipoProveedor inválido OK");
  }

  console.log("✅ Todos los tests de tiposProveedor.service pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});