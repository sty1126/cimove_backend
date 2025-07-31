import * as repo from "./tiposMetodoPago.repository.js";

export const getTiposMetodoPago = async () => {
  return await repo.obtenerTiposMetodoPago();
};

export const crearTipoMetodoPago = async (data) => {
  const { nombre, comision, recepcion } = data;

  if (!nombre || comision == null || recepcion == null) {
    throw new Error("Todos los campos son obligatorios");
  }

  await repo.insertarTipoMetodoPago(nombre, comision, recepcion);
};

export const actualizarTipoMetodoPago = async (id, data) => {
  const { nombre, comision, recepcion } = data;

  if (!nombre || comision == null || recepcion == null) {
    throw new Error("Todos los campos son obligatorios");
  }

  await repo.actualizarTipoMetodoPago(id, nombre, comision, recepcion);
};

export const eliminarTipoMetodoPago = async (id) => {
  await repo.inhabilitarTipoMetodoPago(id);
};
