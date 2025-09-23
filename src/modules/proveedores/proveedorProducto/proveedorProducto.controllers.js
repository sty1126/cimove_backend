import { 
  obtenerPorProducto,
  obtenerPorVariosProductos,
  obtenerPorProveedor,
  asociarProveedor,
  desasociarProveedor,
  eliminarAsociacionPorIds
} from "./proveedorProducto.service.js";

// /:id_producto
export const getProveedoresByProducto = async (req, res) => {
  try {
    const data = await obtenerPorProducto(req.params.id_producto);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener proveedores del producto" });
  }
};

// /ids=1,2,3
export const getProveedoresByMultipleProductos = async (req, res) => {
  try {
    const data = await obtenerPorVariosProductos(req.query.ids);
    res.json(data);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getProductosByProveedor = async (req, res) => {
  try {
    const data = await obtenerPorProveedor(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener productos del proveedor" });
  }
};

//POST
export const asociarProveedorAProducto = async (req, res) => {
  try {
    const asociacion = await asociarProveedor(req.body);
    res.status(201).json(asociacion);
  } catch (error) {
    // Si es un error de duplicado, usar 409 Conflict
    if (error.message.includes("ya está asociado")) {
      return res.status(409).json({ error: error.message });
    }
    res.status(400).json({ error: error.message });
  }
};

// PUT /:id_proveedorproducto
export const eliminarAsociacion = async (req, res) => {
  try {
    const result = await desasociarProveedor(req.params.id_proveedorproducto);
    if (!result) return res.status(404).json({ error: "Asociación no encontrada" });
    res.json({ message: "Proveedor desasociado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al desasociar proveedor del producto" });
  }
};

export const desasociarProveedorDeProducto = async (req, res) => {
  try {
    const { id_proveedor, id_producto } = req.body;

    // Validar que lleguen los datos
    if (!id_proveedor || !id_producto) {
      return res.status(400).json({ error: "Se requieren id_proveedor e id_producto" });
    }

    // Llamar al service para inactivar la asociación
    const resultado = await eliminarAsociacionPorIds(id_proveedor, id_producto);
    res.json({ 
      message: "Asociación inactivada correctamente", 
      data: resultado 
    });
  } catch (error) {
    console.error("ERROR DETALLADO:", error);
    
    // Devolver un error más descriptivo al cliente
    res.status(500).json({ 
      error: error.message || "Error al desasociar proveedor del producto",
      // Incluir detalles adicionales si no estamos en producción
      details: process.env.NODE_ENV !== 'production' ? error.stack : undefined
    });
  }
};
