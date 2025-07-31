import { ProveedorProductoRepository } from "./proveedorProducto.repository.js";

export const ProveedorProductoService = {
  async obtenerPorProducto(id_producto) {
    const { rows } = await ProveedorProductoRepository.obtenerPorProducto(id_producto);
    return rows;
  },

  async obtenerPorVariosProductos(idsQuery) {
    if (!idsQuery) throw new Error("Faltan los IDs de producto");

    const idList = idsQuery
      .split(",")
      .map((id) => parseInt(id))
      .filter((id) => !isNaN(id));

    if (idList.length === 0) throw new Error("IDs de producto inválidos");

    const { rows } = await ProveedorProductoRepository.obtenerPorVariosProductos(idList);
    return rows;
  },

  async asociarProveedor(data) {
    if (!data.id_proveedor_proveedorproducto || !data.id_producto_proveedorproducto) {
      throw new Error("Faltan datos requeridos");
    }

    const { rows } = await ProveedorProductoRepository.asociarProveedorAProducto(data);
    return rows[0];
  },

  async desasociarProveedor(id) {
    const { rows } = await ProveedorProductoRepository.desasociarProveedor(id);
    if (rows.length === 0) return null;
    return rows[0];
  },
};
