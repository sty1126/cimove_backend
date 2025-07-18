import * as facturaService from "./factura.service.js";

export const createFacturaController = async (req, res) => {
  try {
    const result = await facturaService.createFactura(req.body);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error registrando factura:", error);
    res.status(500).json({ error: "Error registrando la factura" });
  }
};

export const getFacturasController = async (req, res) => {
  try {
    const facturas = await facturaService.getFacturas();
    res.json(facturas);
  } catch (error) {
    console.error("Error obteniendo facturas:", error);
    res.status(500).json({ error: "Error al listar las facturas" });
  }
};

export const getFacturaByIdController = async (req, res) => {
  const { idFactura } = req.params;
  try {
    const result = await facturaService.getFacturaById(idFactura);
    if (result.length === 0) {
      return res.status(404).json({ error: "Factura no encontrada" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error obteniendo factura por ID:", error);
    res.status(500).json({ error: "Error al obtener la factura" });
  }
};