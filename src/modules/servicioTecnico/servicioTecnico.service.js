import * as repo from "./servicioTecnico.repository.js";

export async function createServicioTecnico(req, res) {
  try {
    const servicio = await repo.insertServicioTecnico(req.body);
    res.status(201).json({
      message: "Servicio técnico creado exitosamente",
      servicioTecnico: servicio,
    });
  } catch (error) {
    console.error("Error al crear servicio técnico:", error);
    res.status(500).json({ error: error.message || "Error interno del servidor" });
  }
}

export async function getServiciosTecnicos(req, res) {
  try {
    const servicios = await repo.fetchServiciosTecnicos();
    res.json(servicios);
  } catch (error) {
    console.error("Error al obtener servicios técnicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function updateServicioTecnico(req, res) {
  try {
    const { id } = req.params;
    const actualizado = await repo.updateServicioTecnico(id, req.body);

    if (!actualizado) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json({ mensaje: "Servicio técnico actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar servicio técnico:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}

export async function getServicioTecnicoById(req, res) {
  try {
    const { id } = req.params;
    const servicio = await repo.fetchServicioTecnicoById(id);

    if (!servicio) {
      return res.status(404).json({ error: "Servicio técnico no encontrado" });
    }

    res.json(servicio);
  } catch (error) {
    console.error("Error al obtener servicio técnico por ID:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
}
