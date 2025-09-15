import assert from "assert";

// Fake repo
const fakeRepo = {
  obtenerCategoriasActivas: async () => [
    { id_categoria: 1, descripcion_categoria: "Alimentos" },
    { id_categoria: 2, descripcion_categoria: "Ropa" },
  ],
  insertarCategoria: async (descripcion) => ({
    id_categoria: 3,
    descripcion_categoria: descripcion,
    estado_categoria: "A",
  }),
};

// Servicios simulados
async function getCategorias() {
  return await fakeRepo.obtenerCategoriasActivas();
}

async function createCategoria({ descripcion_categoria }) {
  if (!descripcion_categoria) {
    throw new Error("La descripción de la categoría es obligatoria");
  }
  return await fakeRepo.insertarCategoria(descripcion_categoria);
}

async function run() {
  console.log("▶ Tests categoria.service");

  // 1. Obtener categorías
  {
    const cats = await getCategorias();
    assert.strictEqual(cats.length, 2);
    console.log("✔ getCategorias OK");
  }

  // 2. Crear categoría válida
  {
    const nueva = await createCategoria({ descripcion_categoria: "Electrónica" });
    assert.strictEqual(nueva.descripcion_categoria, "Electrónica");
    console.log("✔ createCategoria válido OK");
  }

  // 3. Crear categoría inválida
  {
    let err;
    try {
      await createCategoria({});
    } catch (e) { err = e; }
    assert.strictEqual(err.message, "La descripción de la categoría es obligatoria");
    console.log("✔ createCategoria inválido OK");
  }

  console.log("✅ Todos los tests de categoria.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});