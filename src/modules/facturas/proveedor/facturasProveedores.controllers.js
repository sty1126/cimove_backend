import * as service from "./facturasProveedores.service.js";
// Importar directamente desde el repository donde existe la función
import * as repository from "./facturasProveedores.repository.js";
import { getOrdenCompraById } from "./facturasProveedores.repository.js"; // Importar correctamente

export const getFacturasProveedor = async (req, res) => {
  const data = await service.obtenerFacturas();
  res.json(data);
};

export const getFacturaProveedorById = async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ message: "ID inválido" });
  }

  const data = await service.obtenerFacturaPorId(id);
  if (!data) return res.status(404).json({ message: "No encontrada" });
  res.json(data);
};
export const createFacturaProveedor = async (req, res) => {
  try {
    console.log("Request body createFacturaProveedor:", req.body);

    const idOrdenCompra =
      req.body?.id_ordencompra ??
      req.body?.idOrdenCompra ??
      req.body?.id;

    if (!idOrdenCompra) {
      return res.status(400).json({ error: "Falta id_ordencompra en el body" });
    }

    // Usar el helper correctamente importado desde el repository
    const orden = await getOrdenCompraById(idOrdenCompra);
    
    if (!orden) {
      return res.status(404).json({ error: "Orden de compra no encontrada" });
    }
    
    // Asegurar que todos los campos en detalles tienen el formato correcto
    const detallesFormateados = orden.detalles.map(det => ({
      id_producto: det.id_producto,
      cantidad: parseInt(det.cantidad, 10) || 0,
      precio_unitario: parseFloat(det.precio_unitario) || 0,
      subtotal: parseFloat(det.subtotal) || parseFloat(det.cantidad) * parseFloat(det.precio_unitario) || 0
    }));
    
    // AQUÍ ESTÁ EL CAMBIO CLAVE:
    // Calcular el monto total sumando los subtotales de los detalles
    // Independientemente de lo que envíe el frontend
    const montoCalculado = detallesFormateados.reduce(
      (total, detalle) => total + detalle.subtotal, 
      0
    );
    
    console.log(`Monto calculado desde detalles: ${montoCalculado}`);
    
    // Usar el monto calculado si es mayor que cero, o el valor enviado de la request
    // o el valor de la orden, en ese orden de prioridad
    let monto = montoCalculado > 0 
      ? montoCalculado 
      : (req.body?.monto_facturaproveedor || req.body?.monto || orden.total_ordencompra || 0);

    // Fecha
    const fecha = req.body?.fecha_facturaproveedor ?? orden.fecha_ordencompra;
    const fecha_facturaproveedor = fecha
      ? new Date(fecha).toISOString().split("T")[0]
      : new Date().toISOString().split("T")[0];

    // Payload final
    const payload = {
      id_ordencompra: orden.id_ordencompra,
      fecha_facturaproveedor,
      monto_facturaproveedor: monto,  // Usar el monto calculado
      detalles: detallesFormateados,
    };

    console.log("Payload final a insertar:", payload);

    const nuevaFactura = await service.insert(payload);

    res.json({
      message: "Factura proveedor creada con éxito",
      factura: nuevaFactura,
      monto_calculado: monto  // Incluir el monto calculado en la respuesta para verificación
    });
  } catch (error) {
    console.error("Error al crear factura proveedor:", error);
    res.status(500).json({ error: `Error al crear factura proveedor: ${error.message}` });
  }
};
