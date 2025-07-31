import * as service from "./tiposMetodoPago.service.js";

export const getTiposMetodoPagoController = async (req, res) => {
  try {
    const tipos = await service.getTiposMetodoPago();
    res.json(tipos);
  } catch (error) {
    console.error("Error al obtener tipos de método de pago:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const crearTipoMetodoPagoController = async (req, res) => {
  try {
    await service.crearTipoMetodoPago(req.body);
    res.status(201).json({ mensaje: "Tipo de método de pago creado con éxito" });
  } catch (error) {
    console.error("Error al crear tipo de método de pago:", error.message);
    res.status(500).json({ error: "Error al crear tipo de método de pago" });
  }
};

export const actualizarTipoMetodoPagoController = async (req, res) => {
  try {
    await service.actualizarTipoMetodoPago(req.params.id, req.body);
    res.json({ mensaje: "Tipo de método de pago actualizado con éxito" });
  } catch (error) {
    console.error("Error al actualizar tipo de método de pago:", error.message);
    res.status(500).json({ error: "Error al actualizar tipo de método de pago" });
  }
};

export const eliminarTipoMetodoPagoController = async (req, res) => {
  try {
    await service.eliminarTipoMetodoPago(req.params.id);
    res.json({ mensaje: "Tipo de método de pago eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar tipo de método de pago:", error.message);
    res.status(500).json({ error: "Error al eliminar tipo de método de pago" });
  }
};
