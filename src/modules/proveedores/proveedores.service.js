import { ProveedoresRepository } from "./proveedores.repository.js";

export const ProveedoresService = {
  async obtenerTodos() {
    const { rows } = await ProveedoresRepository.obtenerTodos();
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await ProveedoresRepository.obtenerPorId(id);
    return rows[0] || null;
  },

  async obtenerTipos() {
    const { rows } = await ProveedoresRepository.obtenerTipos();
    return rows;
  },

  async crearTipo(nombre_tipoproveedor) {
    const { rows } = await ProveedoresRepository.crearTipo(nombre_tipoproveedor);
    return rows[0];
  },

  async crearProveedor(data) {
    const existe = await ProveedoresRepository.proveedorExiste(data.id_proveedor);
    if (existe.rows.length > 0) {
      throw new Error("El proveedor ya está registrado");
    }

    const { rows } = await ProveedoresRepository.crearProveedor(data);
    return rows[0];
  },

  async actualizarProveedor(id, datos) {
    const { rows } = await ProveedoresRepository.actualizarProveedor(id, datos);
    return rows[0] || null;
  },

  async eliminarProveedor(id) {
    const { rows } = await ProveedoresRepository.eliminarProveedor(id);
    return rows[0] || null;
  },
};
