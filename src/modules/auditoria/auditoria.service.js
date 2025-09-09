import * as auditoriaRepo from "./auditoria.repository.js";

/**
 * Obtener todas las auditorías
 * @param {Object} filtros Opcional, puede incluir idUsuario, fechaInicio, fechaFin, idTipoMov
 */
export const getAuditorias = async (filtros = {}) => {
  const { idUsuario, fechaInicio, fechaFin, idTipoMov } = filtros;

  // Si se pasan fechas, ambas deben estar presentes
  if ((fechaInicio && !fechaFin) || (!fechaInicio && fechaFin)) {
    throw new Error("Debe especificar fecha inicio y fecha fin");
  }

  // Si se pasa idUsuario, debe ser válido
  if (idUsuario && isNaN(Number(idUsuario))) {
    throw new Error("El ID de usuario debe ser un número válido");
  }

  // Si se pasa idTipoMov, debe ser válido
  if (idTipoMov && isNaN(Number(idTipoMov))) {
    throw new Error("El ID de tipo de movimiento debe ser un número válido");
  }

  // Llamar al repository con los filtros opcionales
  if (idUsuario) {
    return await auditoriaRepo.obtenerAuditoriasPorUsuario(idUsuario);
  } else if (fechaInicio && fechaFin) {
    return await auditoriaRepo.obtenerAuditoriasPorFechas(
      fechaInicio,
      fechaFin
    );
  } else if (idTipoMov) {
    return await auditoriaRepo.obtenerAuditoriasPorTipoMov(idTipoMov);
  } else {
    return await auditoriaRepo.obtenerAuditorias();
  }
};

/**
 * Registrar acción en auditoría
 */
export const registrarAccion = async (data) => {
  return await auditoriaRepo.insertarAuditoria(data);
};
