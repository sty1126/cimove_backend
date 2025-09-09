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

import { pool } from "../../db.js";

export const insertarAuditoria = async (
  tabla,
  operacion,
  idUsuario,
  detalle
) => {
  const query = `
    INSERT INTO auditoria(
      tablaafectada_auditoria,
      operacion_auditoria,
      id_usuario_auditoria,
      detallescambio_auditoria,
      fechaoperacion_auditoria
    ) VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
    RETURNING *;
  `;

  const values = [tabla, operacion, idUsuario, JSON.stringify(detalle)];

  const result = await pool.query(query, values);
  return result.rows[0];
};
