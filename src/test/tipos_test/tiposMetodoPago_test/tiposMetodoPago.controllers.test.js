
import assert from "assert";


const fakeService = {
  getTiposMetodoPago: async () => [
    { id_tipometodopago: 1, nombre_tipometodopago: "Tarjeta" },
  ],
  crearTipoMetodoPago: async (data) => {
    if (!data.nombre) throw new Error("Error de validación del servicio");
  },
  actualizarTipoMetodoPago: async (id, data) => {
    if (!id || !data.nombre) throw new Error("Error de validación del servicio");
  },
  eliminarTipoMetodoPago: async (id) => {},
};

// ======================
// Controllers simulados con fakeService
// ======================
async function getTiposMetodoPagoController(req, res) {
  try {
    const tipos = await fakeService.getTiposMetodoPago();
    res.json(tipos);
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

async function crearTipoMetodoPagoController(req, res) {
  try {
    await fakeService.crearTipoMetodoPago(req.body);
    res.status(201).json({ mensaje: "Tipo de método de pago creado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al crear tipo de método de pago" });
  }
}

async function actualizarTipoMetodoPagoController(req, res) {
  try {
    await fakeService.actualizarTipoMetodoPago(req.params.id, req.body);
    res.json({ mensaje: "Tipo de método de pago actualizado con éxito" });
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar tipo de método de pago" });
  }
}

async function eliminarTipoMetodoPagoController(req, res) {
  try {
    await fakeService.eliminarTipoMetodoPago(req.params.id);
    res.json({ mensaje: "Tipo de método de pago eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar tipo de método de pago" });
  }
}

// ======================
// Mock Express response
// ======================
function createResMock() {
  const res = {};
  res.statusCode = 200;
  res.body = null;
  res.status = function (code) { this.statusCode = code; return this; };
  res.json = function (data) { this.body = data; return this; };
  return res;
}

// ======================
// Tests
// ======================
async function run() {
  console.log("▶ Tests tiposMetodoPago.controllers");

  // Test 1: getTiposMetodoPagoController
  {
    const res = createResMock();
    await getTiposMetodoPagoController({}, res);
    assert.strictEqual(res.statusCode, 200);
    assert.ok(Array.isArray(res.body));
    console.log("✔ getTiposMetodoPagoController OK");
  }

  // Test 2: crearTipoMetodoPagoController - Válido
  {
    const res = createResMock();
    await crearTipoMetodoPagoController({ body: { nombre: "Transferencia", comision: 1.2, recepcion: true } }, res);
    assert.strictEqual(res.statusCode, 201);
    assert.strictEqual(res.body.mensaje, "Tipo de método de pago creado con éxito");
    console.log("✔ crearTipoMetodoPagoController válido OK");
  }

  // Test 3: crearTipoMetodoPagoController - Inválido (falla en el servicio)
  {
    const res = createResMock();
    await crearTipoMetodoPagoController({ body: {} }, res);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.error, "Error al crear tipo de método de pago");
    console.log("✔ crearTipoMetodoPagoController inválido OK");
  }

  // Test 4: actualizarTipoMetodoPagoController - Válido
  {
    const res = createResMock();
    await actualizarTipoMetodoPagoController({ params: { id: 1 }, body: { nombre: "Actualizado" } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.mensaje, "Tipo de método de pago actualizado con éxito");
    console.log("✔ actualizarTipoMetodoPagoController válido OK");
  }

  // Test 5: actualizarTipoMetodoPagoController - Inválido (falla en el servicio)
  {
    const res = createResMock();
    await actualizarTipoMetodoPagoController({ params: { id: 1 }, body: {} }, res);
    assert.strictEqual(res.statusCode, 500);
    assert.strictEqual(res.body.error, "Error al actualizar tipo de método de pago");
    console.log("✔ actualizarTipoMetodoPagoController inválido OK");
  }

  // Test 6: eliminarTipoMetodoPagoController
  {
    const res = createResMock();
    await eliminarTipoMetodoPagoController({ params: { id: 1 } }, res);
    assert.strictEqual(res.statusCode, 200);
    assert.strictEqual(res.body.mensaje, "Tipo de método de pago eliminado correctamente");
    console.log("✔ eliminarTipoMetodoPagoController OK");
  }

  console.log("✅ Todos los tests de tiposMetodoPago.controllers pasaron");
}

run().catch((err) => {
  console.error("❌ Error en tests:", err);
  process.exit(1);
});