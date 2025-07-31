import { ProductosRepository } from "./productos.repository.js";

export const ProductosService = {
  async obtenerTodos() {
    const { rows } = await ProductosRepository.obtenerTodos();
    return rows;
  },

  async obtenerPorId(id) {
    const { rows } = await ProductosRepository.obtenerPorId(id);
    return rows[0] || null;
  },

  async obtenerDetalles() {
    const { rows } = await ProductosRepository.obtenerDetalles();
    return rows;
  },

  async crearProducto(data) {
    const { rows } = await ProductosRepository.crearProducto(data);
    return rows[0];
  },

  async actualizarProducto(productoId, nuevosDatos) {
    const productoActual = await this.obtenerPorId(productoId);
    if (!productoActual) return null;

    const datosActualizados = {
      id_categoria_producto: nuevosDatos.id_categoria_producto ?? productoActual.id_categoria_producto,
      nombre_producto: nuevosDatos.nombre_producto ?? productoActual.nombre_producto,
      descripcion_producto: nuevosDatos.descripcion_producto ?? productoActual.descripcion_producto,
      precioventaact_producto: nuevosDatos.precioventaact_producto ?? productoActual.precioventaact_producto,
      precioventaant_producto: nuevosDatos.precioventaant_producto ?? productoActual.precioventaant_producto,
      costoventa_producto: nuevosDatos.costoventa_producto ?? productoActual.costoventa_producto,
      margenutilidad_producto: nuevosDatos.margenutilidad_producto ?? productoActual.margenutilidad_producto,
      valoriva_producto: nuevosDatos.valoriva_producto ?? productoActual.valoriva_producto,
      estado_producto: nuevosDatos.estado_producto ?? productoActual.estado_producto,
    };

    const { rows } = await ProductosRepository.actualizarProducto(productoId, datosActualizados);
    return rows[0];
  },

  async obtenerDetallePorId(productoId) {
    const [productoRes, inventarioRes] = await ProductosRepository.obtenerDetallePorId(productoId);
    if (productoRes.rows.length === 0) return null;

    const producto = productoRes.rows[0];
    producto.inventario_sedes = inventarioRes.rows;
    return producto;
  },

  async eliminarProducto(id) {
    const { rows } = await ProductosRepository.eliminarProducto(id);
    return rows[0] || null;
  },

  async obtenerProveedores(productoId) {
    const { rows } = await ProductosRepository.obtenerProveedoresPorProducto(productoId);
    return rows;
  },
};
