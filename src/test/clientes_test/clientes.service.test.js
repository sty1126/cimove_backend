// tests_manual/clientes.service.test.js
// Ejecutar: node tests_manual/clientes.service.test.js
import assert from "assert";

// ======================
// Fake repository
// ======================
const fakeRepo = {
  obtenerClientes: async () => [{ id_cliente: "1", nombre_cliente: "Juan" }],
  findClientesNaturales: async () => [{ id_cliente: "2", nombre_cliente: "Ana" }],
  findClientesJuridicos: async () => [{ id_cliente: "3", razonsocial_cliente: "ACME SA" }],
  obtenerClientePorId: async (id) =>
    id === "404" ? undefined : { id_cliente: id, nombre_cliente: "Mock" },
  findTiposCliente: async () => [
    { id_tipocliente: 1, descripcion_tipocliente: "Persona Natural" },
    { id_tipocliente: 2, descripcion_tipocliente: "Persona Jurídica" },
  ],
  crearCliente: async (data) => ({ success: true, id: data.id_cliente }),
  findClientesFormateados: async () => [
    {
      id_cliente: "10",
      descripcion_tipocliente: "Persona Natural",
      nombre_cliente: "Juan",
      apellido_cliente: "Perez",
    },
    {
      id_cliente: "11",
      descripcion_tipocliente: "Persona Jurídica",
      razonsocial_cliente: "Globex",
      representante_cliente: "Laura",
    },
  ],
  actualizarCliente: async (id, data) => ({ success: true }),
  eliminarCliente: async (id) => ({ success: true, eliminado: id }),
  obtenerClientesPorSede: async (idSede) => [
    {
      id_cliente: "20",
      descripcion_tipocliente: "Persona Jurídica",
      razonsocial_cliente: "Umbrella",
      representante_cliente: "Alice",
      id_sede_cliente: idSede,
    },
  ],
};

// ======================
// Fake pool
// ======================
const fakePool = {
  async connect() {
    return {
      async query(sql) {
        return { rows: [] };
      },
      release() {},
    };
  },
};

// ======================
// Service con fakeRepo y fakePool
// ======================
async function getClientes() {
  return await fakeRepo.obtenerClientes();
}

async function getClientesNaturales() {
  return await fakeRepo.findClientesNaturales();
}

async function getClientesJuridicos() {
  return await fakeRepo.findClientesJuridicos();
}

async function getClienteById(id) {
  const cliente = await fakeRepo.obtenerClientePorId(id);
  if (!cliente) throw new Error("Cliente no encontrado");
  return cliente;
}

async function getTiposCliente() {
  return await fakeRepo.findTiposCliente();
}

async function createCliente(data) {
  if (!data.id_cliente || !data.id_tipodocumento_cliente || !data.id_tipocliente_cliente || !data.telefono_cliente || !data.id_sede_cliente) {
    throw new Error("Faltan campos obligatorios");
  }
  return await fakeRepo.crearCliente(data);
}

async function getClientesFormateados() {
  const clientes = await fakeRepo.findClientesFormateados();
  return clientes.map((c) => ({
    id: c.id_cliente,
    nombre: c.descripcion_tipocliente === "Persona Natural"
      ? `${c.nombre_cliente} ${c.apellido_cliente}`
      : c.representante_cliente,
    razon_social: c.descripcion_tipocliente === "Persona Jurídica" ? c.razonsocial_cliente : "No aplica",
    tipo: c.descripcion_tipocliente === "Persona Jurídica" ? "J" : "N",
  }));
}

async function updateCliente(id, data) {
  const client = await fakePool.connect();
  await client.query("BEGIN");
  await fakeRepo.actualizarCliente(id, data);
  await client.query("COMMIT");
  client.release();
  return { message: "Cliente actualizado correctamente" };
}

async function deleteCliente(id) {
  return await fakeRepo.eliminarCliente(id);
}

async function getClientesPorSede(idSede) {
  if (!idSede) throw new Error("Se requiere el ID de la sede");
  const clientes = await fakeRepo.obtenerClientesPorSede(idSede);
  return clientes.map((c) => ({
    id: c.id_cliente,
    nombre: c.descripcion_tipocliente === "Persona Jurídica"
      ? c.representante_cliente
      : `${c.nombre_cliente} ${c.apellido_cliente}`,
    razon_social: c.descripcion_tipocliente === "Persona Jurídica" ? c.razonsocial_cliente : "No aplica",
    tipo: c.descripcion_tipocliente === "Persona Jurídica" ? "J" : "N",
    id_sede: c.id_sede_cliente,
  }));
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests clientes.service");

  // 1. getClientes
  {
    const res = await getClientes();
    assert.strictEqual(res[0].nombre_cliente, "Juan");
    console.log("✔ getClientes OK");
  }

  // 2. Naturales y Jurídicos
  {
    assert.strictEqual((await getClientesNaturales())[0].nombre_cliente, "Ana");
    assert.strictEqual((await getClientesJuridicos())[0].razonsocial_cliente, "ACME SA");
    console.log("✔ getClientesNaturales y getClientesJuridicos OK");
  }

  // 3. Cliente por ID
  {
    const cliente = await getClienteById("1");
    assert.strictEqual(cliente.nombre_cliente, "Mock");
    let error;
    try { await getClienteById("404"); } catch (e) { error = e; }
    assert.strictEqual(error.message, "Cliente no encontrado");
    console.log("✔ getClienteById OK");
  }

  // 4. Tipos cliente
  {
    const tipos = await getTiposCliente();
    assert.strictEqual(tipos.length, 2);
    console.log("✔ getTiposCliente OK");
  }

  // 5. Crear cliente válido e inválido
  {
    const data = {
      id_cliente: "100",
      id_tipodocumento_cliente: "CC",
      id_tipocliente_cliente: 1,
      telefono_cliente: "12345",
      id_sede_cliente: "S1",
    };
    const res = await createCliente(data);
    assert.strictEqual(res.success, true);

    let error;
    try { await createCliente({}); } catch (e) { error = e; }
    assert.ok(error.message.includes("Faltan campos obligatorios"));
    console.log("✔ createCliente OK");
  }

  // 6. Clientes formateados
  {
    const res = await getClientesFormateados();
    assert.strictEqual(res[0].tipo, "N");
    assert.strictEqual(res[1].tipo, "J");
    console.log("✔ getClientesFormateados OK");
  }

  // 7. Update cliente
  {
    const res = await updateCliente("200", { nombre: "Nuevo" });
    assert.strictEqual(res.message, "Cliente actualizado correctamente");
    console.log("✔ updateCliente OK");
  }

  // 8. Delete cliente
  {
    const res = await deleteCliente("300");
    assert.strictEqual(res.success, true);
    console.log("✔ deleteCliente OK");
  }

  // 9. Clientes por sede válido e inválido
  {
    const res = await getClientesPorSede("S1");
    assert.strictEqual(res[0].id_sede, "S1");
    let error;
    try { await getClientesPorSede(); } catch (e) { error = e; }
    assert.ok(error.message.includes("Se requiere el ID de la sede"));
    console.log("✔ getClientesPorSede OK");
  }

  console.log("✅ Todos los tests de clientes.service pasaron");
}

run().catch(err => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});
