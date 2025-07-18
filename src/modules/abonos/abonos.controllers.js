import * as abonoService from "./abonos.service.js";

export const getAbonosController = async (req, res) => {
  try {
    const abonos = await abonoService.getAbonos();
    res.json(abonos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

export const createAbonoController = async (req, res) => {
  try {
    const nuevoAbono = await abonoService.createAbono(req.body);
    res.status(201).json(nuevoAbono);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getAbonosPorFacturaController = async (req, res) => {
  try {
    const abonos = await abonoService.getAbonosPorFactura(req.params.idFactura);
    res.json(abonos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener abonos" });
  }
};

export const anularAbonoController = async (req, res) => {
  try {
    const resultado = await abonoService.anularAbono(req.params.id);
    res.json(resultado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTotalAbonadoPorFacturaController = async (req, res) => {
  try {
    const total = await abonoService.getTotalAbonadoPorFactura(req.params.idFactura);
    res.json(total);
  } catch (error) {
    res.status(500).json({ error: "Error al calcular el total abonado" });
  }
};
