import * as service from "./facturasProveedores.service.js";

export const getFacturasProveedor = async (req, res) => {
  const data = await service.obtenerFacturas();
  res.json(data);
};

export const getFacturaProveedorById = async (req, res) => {
  const data = await service.obtenerFacturaPorId(req.params.id);
  if (!data) return res.status(404).json({ message: "No encontrada" });
  res.json(data);
};

export const createFacturaProveedor = async (req, res) => {
  const data = await service.crearFactura(req.body);
  res.status(201).json({ message: "Factura proveedor creada", factura: data });
};
