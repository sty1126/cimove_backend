import * as repo from "./tiposDocumento.repository.js";

export const getTiposDocumento = async () => {
  return await repo.obtenerTiposDocumento();
};
