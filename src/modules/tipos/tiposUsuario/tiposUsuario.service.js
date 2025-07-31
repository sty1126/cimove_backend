import * as tuRepo from "./tiposUsuario.repository.js";

export const getActiveTiposUsuario = async () => {
  return await tuRepo.fetchActiveTiposUsuario();
};