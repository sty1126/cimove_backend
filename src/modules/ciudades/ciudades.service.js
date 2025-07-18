import * as ciudadRepo from "./ciudades.repository.js";

export const getCiudades = () => ciudadRepo.obtenerCiudadesActivas();

export const createCiudad = async ({ nombre_ciudad }) => {
  if (!nombre_ciudad) {
    throw new Error("El nombre de la ciudad es requerido");
  }
  return await ciudadRepo.insertarCiudad(nombre_ciudad);
};
