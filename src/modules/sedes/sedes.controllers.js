import { SedesService } from "./sedes.service.js";

export const getSedes = async (req, res) => {
  try {
    const sedes = await SedesService.obtenerTodas();
    res.json(sedes);
  } catch (error) {
    console.error("Error al obtener sedes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createSede = async (req, res) => {
  const { nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede } = req.body;

  if (!nombre_sede || !id_ciudad_sede || !direccion_sede || !numeroempleados_sede) {
    return res.status(400).json({ error: "Todos los campos obligatorios deben ser proporcionados" });
  }

  try {
    const nuevaSede = await SedesService.crearSede({ nombre_sede, id_ciudad_sede, direccion_sede, numeroempleados_sede, telefono_sede });
    res.status(201).json(nuevaSede);
  } catch (error) {
    console.error("Error al agregar sede:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const deactivateSede = async (req, res) => {
  try {
    const desactivada = await SedesService.desactivarSede(req.params.id_sede);
    if (!desactivada) return res.status(404).json({ error: "Sede no encontrada" });
    res.json({ message: "Sede desactivada correctamente" });
  } catch (error) {
    console.error("Error al desactivar sede:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getSedeById = async (req, res) => {
  try {
    const sede = await SedesService.obtenerPorId(req.params.id_sede);
    if (!sede) return res.status(404).json({ error: "Sede no encontrada" });
    res.json(sede);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener la sede" });
  }
};

export const getSedeByNombre = async (req, res) => {
  try {
    const sede = await SedesService.obtenerIdPorNombre(req.params.nombre_sede);
    if (!sede) return res.status(404).json({ error: "Sede no encontrada" });
    res.json(sede);
  } catch (error) {
    console.error("Error al obtener sede por nombre:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
