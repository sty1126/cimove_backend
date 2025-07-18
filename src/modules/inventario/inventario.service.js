import * as repo from './inventario.repository.js';

export async function getInventario(req, res) {
  try {
    const result = await repo.fetchAll();
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el inventario" });
  }
}

export async function getInventarioById(req, res) {
  try {
    const result = await repo.fetchById(req.params.inventarioId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el inventario" });
  }
}

export async function createInventario(req, res) {
  try {
    const result = await repo.insert(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el inventario" });
  }
}

export async function updateInventario(req, res) {
  try {
    const result = await repo.update(req.params.inventarioId, req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el inventario" });
  }
}
