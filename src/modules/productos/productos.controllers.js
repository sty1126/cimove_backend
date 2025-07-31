import { ProductosService } from "./productos.service.js";

export const getProductos = async (req, res) => {
  try {
    const productos = await ProductosService.obtenerTodos();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

export const getProducto = async (req, res) => {
  try {
    const producto = await ProductosService.obtenerPorId(req.params.productoId);
    if (!producto) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const getProductosDetalles = async (req, res) => {
  try {
    const detalles = await ProductosService.obtenerDetalles();
    res.json(detalles);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalles de los productos" });
  }
};

export const createProducto = async (req, res) => {
  try {
    const nuevo = await ProductosService.crearProducto(req.body);
    res.status(201).json(nuevo);
  } catch (error) {
    res.status(500).json({ message: "Error al registrar el producto" });
  }
};

export const putProducto = async (req, res) => {
  try {
    const actualizado = await ProductosService.actualizarProducto(req.params.productoId, req.body);
    if (!actualizado) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto actualizado correctamente", producto: actualizado });
  } catch (error) {
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};

export const getProductoDetalle = async (req, res) => {
  try {
    const detalle = await ProductosService.obtenerDetallePorId(req.params.productoId);
    if (!detalle) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(detalle);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener detalles del producto" });
  }
};

export const deleteProducto = async (req, res) => {
  try {
    const eliminado = await ProductosService.eliminarProducto(req.params.id);
    if (!eliminado) return res.status(404).json({ error: "Producto no encontrado" });
    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getProveedoresPorProducto = async (req, res) => {
  try {
    const proveedores = await ProductosService.obtenerProveedores(req.params.productoId);
    res.json(proveedores);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener proveedores" });
  }
};
