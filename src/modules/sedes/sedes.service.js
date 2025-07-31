import { SedesRepository } from "./sedes.repository.js";

export const SedesService = {
  async obtenerTodas() {
    const { rows } = await SedesRepository.obtenerTodas();
    return rows;
  },

  async crearSede(data) {
    const { rows } = await SedesRepository.crear(data);
    return rows[0];
  },

  async desactivarSede(id_sede) {
    const { rowCount } = await SedesRepository.desactivar(id_sede);
    return rowCount > 0;
  },

  async obtenerIdPorNombre(nombre_sede) {
    const { rows } = await SedesRepository.obtenerIdPorNombre(nombre_sede);
    return rows[0] || null;
  }
};
