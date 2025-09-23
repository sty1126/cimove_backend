import { 
  obtenerPorProducto as repositoryObtenerPorProducto,
  obtenerPorVariosProductos as repositoryObtenerPorVariosProductos,
  obtenerPorProveedor as repositoryObtenerPorProveedor,
  verificarAsociacionExistente,
  asociarProveedorAProducto,
  desasociarProveedor as repositoryDesasociarProveedor,
  inactivarAsociacion
} from "./proveedorProducto.repository.js";

export const obtenerPorProducto = async (id_producto) => {
  const { rows } = await repositoryObtenerPorProducto(id_producto);  // Use renamed import
  return rows;
};
export const obtenerPorVariosProductos = async (idsQuery) => {
  if (!idsQuery) throw new Error("Faltan los IDs de producto");

  const idList = idsQuery
    .split(",")
    .map((id) => parseInt(id))
    .filter((id) => !isNaN(id));

  if (idList.length === 0) throw new Error("IDs de producto inválidos");

  const { rows } = await repositoryObtenerPorVariosProductos(idList);
  return rows;
};

export const obtenerPorProveedor = async (id_proveedor) => {
  const { rows } = await repositoryObtenerPorProveedor(id_proveedor);
  return rows;
};

export const asociarProveedor = async (data) => {
  if (!data.id_proveedor_proveedorproducto || !data.id_producto_proveedorproducto) {
    throw new Error("Faltan datos requeridos");
  }

  // Verificar si ya existe la asociación
  const { rows: verificacion } = await verificarAsociacionExistente(
    data.id_proveedor_proveedorproducto,
    data.id_producto_proveedorproducto
  );

  if (verificacion[0].existe) {
    throw new Error("Este proveedor ya está asociado con este producto");
  }

  const { rows } = await asociarProveedorAProducto(data);
  return rows[0];
};

export const desasociarProveedor = async (id) => {
  const { rows } = await repositoryDesasociarProveedor(id);
  if (rows.length === 0) return null;
  return rows[0];
};

export const eliminarAsociacionPorIds = async (idProveedor, idProducto) => {
  try {
    if (!idProveedor || !idProducto) {
      throw new Error("Se requieren los IDs del proveedor y producto");
    }
    
    // Llamar a la función del repositorio
    const { rows } = await inactivarAsociacion(idProveedor, idProducto);

    if (rows.length === 0) {
      throw new Error("No se encontró la asociación o ya está inactiva");
    }
    return rows[0];
  } catch (error) {
    console.error("❌ Error en eliminarAsociacionPorIds:", error);
    throw new Error(`Error al eliminar asociación: ${error.message}`);
  }
};
