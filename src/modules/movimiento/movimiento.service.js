import * as repo from './movimiento.repository.js';

export async function getMovimientos(req, res) {
  try {
    const data = await repo.fetchMovimientos();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener movimientos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getTipoMovimientos(req, res) {
  try {
    const data = await repo.fetchTipoMovimientos();
    res.json(data);
  } catch (error) {
    console.error("Error al obtener tipos de movimientos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function createMovimiento(req, res) {
  try {
    const nuevoMovimiento = await repo.insertMovimiento(req.body);
    res.status(201).json({
      message: "Movimiento registrado con éxito",
      movimiento: nuevoMovimiento
    });
  } catch (error) {
    console.error("❌ Error al agregar movimiento:", error);
    res.status(error.status || 500).json({
      error: error.message || "Error interno del servidor"
    });
  }
}
