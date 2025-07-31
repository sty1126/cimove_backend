import * as repo from "./tiposCliente.repository.js";

export const getTiposCliente = async () => {
  return await repo.obtenerTiposCliente();
};
