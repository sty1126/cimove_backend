import * as repo from "./tiposProveedor.repository.js";

export const getTiposProveedor = async () => {
  return await repo.obtenerTiposProveedor();
};

export const createTipoProveedor = async ({ nombre_tipoproveedor }) => {
  if (!nombre_tipoproveedor) {
    throw new Error("El nombre del tipo de proveedor es obligatorio");
  }

  return await repo.insertarTipoProveedor(nombre_tipoproveedor);
};
