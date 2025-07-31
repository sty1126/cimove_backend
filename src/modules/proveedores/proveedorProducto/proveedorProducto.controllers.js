import { ProveedorProductoService } from "./proveedorProducto.service.js";

// /:id_producto
export const getProveedoresByProducto = async (req, res) => {
  try {
    const data = await ProveedorProductoService.obtenerPorProducto(req.params.id_producto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proveedores del producto" });
  }
};

// /ids=1,2,3
export const getProveedoresByMultipleProductos = async (req, res) => {
  try {
    const data = await ProveedorProductoService.obtenerPorVariosProductos(req.query.ids);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//POST
export const asociarProveedorAProducto = async (req, res) => {
  try {
    const asociacion = await ProveedorProductoService.asociarProveedor(req.body);
    res.status(201).json(asociacion);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// PUT /:id_proveedorproducto
export const desasociarProveedorDeProducto = async (req, res) => {
  try {
    const result = await ProveedorProductoService.desasociarProveedor(req.params.id_proveedorproducto);
    if (!result) return res.status(404).json({ error: "Asociación no encontrada" });
    res.json({ message: "Proveedor desasociado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al desasociar proveedor del producto" });
  }
};
