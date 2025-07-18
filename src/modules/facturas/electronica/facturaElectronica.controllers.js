import * as service from "./facturaElectronica.service.js";

export const getFacturasElectronicas = async (req, res) => {
  const data = await service.obtenerFacturasActivas();
  res.json(data);
};

export const getFacturaElectronicaById = async (req, res) => {
  const data = await service.obtenerFacturaPorId(req.params.id);
  if (!data) return res.status(404).json({ message: "No encontrada" });
  res.json(data);
};

export const createFacturaElectronica = async (req, res) => {
  const data = await service.crearFactura(req.body);
  res.status(201).json(data);
};

export const updateFacturaElectronica = async (req, res) => {
  const data = await service.actualizarFactura(req.params.id, req.body);
  if (!data) return res.status(404).json({ message: "No encontrada o inactiva" });
  res.json({ message: "Actualizada correctamente", factura: data });
};

export const deleteFacturaElectronica = async (req, res) => {
  const deleted = await service.eliminarFactura(req.params.id);
  if (!deleted) return res.status(404).json({ message: "No encontrada" });
  res.json({ message: "Factura eliminada correctamente" });
};
