import * as mpRepo from "./metodosPago.repository.js";

export const addMetodosPagoToFactura = async (idFactura, metodosPago) => {
  if (!Array.isArray(metodosPago) || metodosPago.length === 0) {
    throw new Error("Se requiere al menos un método de pago.");
  }

  const addedMethods = [];
  for (const pago of metodosPago) {
    if (!pago.idTipoMetodoPago || pago.monto == null) {
      throw new Error("Cada método de pago debe tener idTipoMetodoPago y monto.");
    }
    const newMetodo = await mpRepo.insertMetodoPago(
      idFactura,
      pago.idTipoMetodoPago,
      pago.monto
    );
    addedMethods.push(newMetodo);
  }
  return { mensaje: "Métodos de pago agregados con éxito", addedMethods };
};

export const getMetodosPagoByFactura = async (idFactura) => {
  return await mpRepo.fetchMetodosPagoByFacturaId(idFactura);
};

export const getAllMetodosPago = async () => {
  return await mpRepo.fetchAllActiveMetodosPago();
};

export const annulMetodoPago = async (idMetodoPago) => {
  const deactivated = await mpRepo.deactivateMetodoPagoById(idMetodoPago);
  if (!deactivated) {
    throw new Error("Método de pago no encontrado o ya inactivo.");
  }
  return { mensaje: "Método de pago anulado con éxito", metodoAnulado: deactivated };
};