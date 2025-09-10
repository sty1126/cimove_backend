import * as repo from "./inventariolocal.repository.js";

export async function getInventarioLocal(req, res) {
  try {
    const data = await repo.fetchAll();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener el inventario local" });
  }
}

export async function getInventarioLocalBySede(req, res) {
  try {
    const data = await repo.fetchBySede(req.params.sedeId);
    res.json(data);
  } catch (err) {
    if (err.message === "No hay inventario en esta sede") {
      res.status(404).json({ message: err.message });
    } else {
      console.error(err);
      res
        .status(500)
        .json({ message: "Error al obtener inventario local por sede" });
    }
  }
}

export async function createInventarioLocal(req, res) {
  try {
    const nuevo = await repo.insert(req.body);
    res.status(201).json(nuevo);
  } catch (err) {
    res.status(err.status || 500).json({
      message: err.message || "Error al registrar el inventario local",
    });
  }
}

export async function updateInventarioLocal(req, res) {
  try {
    const actualizado = await repo.update(
      req.params.inventarioLocalId,
      req.body
    );
    res.json(actualizado);
  } catch (err) {
    res.status(500).json({ message: err.message || "Error al actualizar" });
  }
}

export async function addStockToSede(req, res) {
  try {
    const { idProducto, idSede } = req.params;
    const { cantidad } = req.body;
    const result = await repo.addStock(idProducto, idSede, cantidad);
    res.json({ message: result });
  } catch (err) {
    res.status(500).json({ error: err.message || "Error al añadir stock" });
  }
}

export async function existeEnInventarioLocal(req, res) {
  try {
    const { idProducto, idSede } = req.params;
    const result = await repo.exists(idProducto, idSede);
    res.json(result);
  } catch (err) {
    res
      .status(500)
      .json({ error: "Error verificando existencia en inventario local" });
  }
}

export async function getInventarioLocalEstado(req, res) {
  try {
    const data = await repo.fetchAllEstados();
    res.json(data);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener inventario por estado" });
  }
}

export async function getInventarioLocalEstadoBySede(req, res) {
  try {
    const data = await repo.fetchBySedeEstado(req.params.sedeId);
    res.json(data);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener inventario por estado y sede" });
  }
}
