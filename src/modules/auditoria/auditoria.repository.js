import { pool } from "../../db.js"; // Ajusta la ruta según tu proyecto

const baseQuery = `
  SELECT 
    a.id_auditoria,
    a.fechaoperacion_auditoria AS fecha_auditoria,
    a.operacion_auditoria AS accion_auditoria,
    a.detallescambio_auditoria AS detalle_auditoria,
    
    u.id_empleado_usuario AS id_usuario,
    u.email_usuario AS username_usuario,
    tu.descripcion_tipousuario,
    e.id_empleado,
    e.nombre_empleado,

    s.id_sede,
    s.nombre_sede,

    tm.nom_tipomov

  FROM auditoria a
  LEFT JOIN usuario u ON u.id_empleado_usuario = a.id_usuario_auditoria
  LEFT JOIN tipousuario tu ON tu.id_tipousuario = u.id_tipousuario_usuario
  LEFT JOIN empleado e ON e.id_empleado = u.id_empleado_usuario
  LEFT JOIN sede s ON s.id_sede = a.id_sede_auditoria
  LEFT JOIN tipomov tm ON tm.id_tipomov = a.id_tipomov_auditoria
`;

export const obtenerAuditorias = async () => {
  const result = await pool.query(
    `${baseQuery} ORDER BY a.fechaoperacion_auditoria DESC`
  );
  return result.rows;
};

export const obtenerAuditoriasPorUsuario = async (idUsuario) => {
  const result = await pool.query(
    `${baseQuery} WHERE a.id_usuario_auditoria = $1 ORDER BY a.fechaoperacion_auditoria DESC`,
    [idUsuario]
  );
  return result.rows;
};

export const obtenerAuditoriasPorFechas = async (fechaInicio, fechaFin) => {
  const result = await pool.query(
    `${baseQuery} WHERE a.fechaoperacion_auditoria BETWEEN $1 AND $2 ORDER BY a.fechaoperacion_auditoria DESC`,
    [fechaInicio, fechaFin]
  );
  return result.rows;
};

export const obtenerAuditoriasPorTipoMov = async (idTipoMov) => {
  const result = await pool.query(
    `${baseQuery} WHERE a.id_tipomov_auditoria = $1 ORDER BY a.fechaoperacion_auditoria DESC`,
    [idTipoMov]
  );
  return result.rows;
};

/**
 * Insertar un registro en la tabla auditoría
 * @param {object} data - Objeto con la información de la auditoría
 * @param {string} data.tabla - Nombre de la tabla afectada
 * @param {string} data.operacion - Tipo de operación: INSERT, UPDATE, DELETE
 * @param {number} data.idUsuario - ID del usuario que realiza la acción
 * @param {object|string} data.detalle - Detalles de los cambios realizados
 * @param {number|null} data.idSede - ID de la sede (opcional)
 * @param {number|null} data.idTipoMov - ID del tipo de movimiento (opcional)
 */
export const insertarAuditoria = async ({
  tabla,
  operacion,
  idUsuario,
  detalle,
  idSede = null,
  idTipoMov = null,
}) => {
  const query = `
    INSERT INTO auditoria(
      tablaafectada_auditoria,
      operacion_auditoria,
      id_usuario_auditoria,
      detallescambio_auditoria,
      fechaoperacion_auditoria,
      id_sede_auditoria,
      id_tipomov_auditoria
    ) VALUES ($1, $2, $3, $4, CURRENT_DATE, $5, $6)
    RETURNING *;
  `;

  const values = [
    tabla,
    operacion,
    idUsuario,
    typeof detalle === "object" ? JSON.stringify(detalle) : detalle,
    idSede,
    idTipoMov,
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};
