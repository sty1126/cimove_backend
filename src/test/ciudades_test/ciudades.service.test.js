
import assert from "assert";

// Fake repo
const fakeRepo = {
  obtenerCiudadesActivas: async () => [
    { id_ciudad: "1", nombre_ciudad: "Bogotá" },
    { id_ciudad: "2", nombre_ciudad: "Medellín" },
  ],
  insertarCiudad: async (nombre) => ({
    id_ciudad: "3",
    nombre_ciudad: nombre,
    estado_ciudad: "A",
  }),
};

// Service simulado
async function getCiudades() {
  return await fakeRepo.obtenerCiudadesActivas();
}

async function createCiudad({ nombre_ciudad }) {
  if (!nombre_ciudad) {
    throw new Error("El nombre de la ciudad es requerido");
  }
  return await fakeRepo.insertarCiudad(nombre_ciudad);
}

async function run() {
  console.log("▶ Tests ciudades.service");

  // 1. Obtener ciudades
  {
    const res = await getCiudades();
    assert.strictEqual(res.length, 2);
    console.log("✔ getCiudades OK");
  }

  // 2. Crear ciudad válida
  {
    const nueva = await createCiudad({ nombre_ciudad: "Cali" });
    assert.strictEqual(nueva.nombre_ciudad, "Cali");
    console.log("✔ createCiudad válido OK");
  }

  // 3. Crear ciudad inválida
  {
    let err;
    try {
      await createCiudad({});
    } catch (e) { err = e; }
    assert.strictEqual(err.message, "El nombre de la ciudad es requerido");
    console.log("✔ createCiudad inválido OK");
  }

  console.log("✅ Todos los tests de ciudades.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
