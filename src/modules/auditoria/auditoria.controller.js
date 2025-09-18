import * as auditoriaService from "./auditoria.service.js";

/**
 * Obtener auditorías
 * Permite filtros opcionales:
 * - idUsuario (path param /usuario/:idUsuario)
 * - idTipoMov (path param /tipomov/:idTipoMov)
 * - fechaInicio y fechaFin (query params /fechas?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD)
 */
export const getAuditoriasController = async (req, res) => {
  try {
    const { idUsuario, idTipoMov } = req.params;
    const { fechaInicio, fechaFin } = req.query;

    const filtros = { idUsuario, idTipoMov, fechaInicio, fechaFin };
    const auditorias = await auditoriaService.getAuditorias(filtros);

    res.json(auditorias);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};

/**
 * Registrar acción en la auditoría
 * Se espera body con: tabla, operacion, idUsuario, detalle, idSede?, idTipoMov?
 */
export const registrarAuditoriaController = async (req, res) => {
  try {
    const data = req.body;
    const auditoria = await auditoriaService.registrarAccion(data);

    res.status(201).json(auditoria);
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: error.message });
  }
};
