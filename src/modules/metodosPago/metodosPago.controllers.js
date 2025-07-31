import * as mpService from "./metodosPago.service.js";

export const agregarMetodosPago = async (req, res) => {
  const { idFactura } = req.params;
  const { metodosPago } = req.body;

  try {
    const result = await mpService.addMetodosPagoToFactura(idFactura, metodosPago);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error al agregar métodos de pago:", error);
    // Use error.message for specific validation errors from service
    res.status(400).json({ mensaje: error.message || "Error al agregar métodos de pago" });
  }
};

export const obtenerMetodosPagoPorFactura = async (req, res) => {
  const { idFactura } = req.params;
  try {
    const metodos = await mpService.getMetodosPagoByFactura(idFactura);
    res.json(metodos);
  } catch (error) {
    console.error("Error al obtener métodos de pago por factura:", error);
    res.status(500).json({ mensaje: "Error al obtener métodos de pago" });
  }
};

export const obtenerTodosLosMetodosPago = async (req, res) => {
  try {
    const metodos = await mpService.getAllMetodosPago();
    res.json(metodos);
  } catch (error) {
    console.error("Error al obtener todos los métodos de pago:", error);
    res.status(500).json({ mensaje: "Error al obtener métodos de pago" });
  }
};

export const anularMetodoPago = async (req, res) => {
  const { idMetodoPago } = req.params;
  try {
    const result = await mpService.annulMetodoPago(idMetodoPago);
    res.json(result);
  } catch (error) {
    console.error("Error al anular método de pago:", error);
    if (error.message.includes("no encontrado")) {
      return res.status(404).json({ mensaje: error.message });
    }
    res.status(500).json({ mensaje: "Error al anular método de pago" });
  }
};