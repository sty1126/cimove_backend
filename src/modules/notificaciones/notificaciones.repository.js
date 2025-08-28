import { pool } from "../../db.js";

// Listar todas las notificaciones activas o con filtros (query params)
export async function fetchNotificaciones(query = {}) {
  const { estado, urgencia, fecha, fechaInicio, fechaFin } = query;

  let sql = "SELECT * FROM NOTIFICACION WHERE 1=1";
  const params = [];
  let i = 1;

  if (estado) {
    sql += ` AND ESTADO_NOTIFICACION = $${i}`;
    params.push(estado);
    i++;
  } else {
    // solo activas si no se pasa estado
    sql += ` AND ESTADO_NOTIFICACION != 'I'`;
  }

  if (urgencia) {
    sql += ` AND URGENCIA_NOTIFICACION = $${i}`;
    params.push(urgencia);
    i++;
  }

  if (fecha) {
    sql += ` AND FECHAINICIO_NOTIFICACION <= $${i} AND FECHAFIN_NOTIFICACION >= $${i}`;
    params.push(fecha);
    i++;
  }

  if (fechaInicio && fechaFin) {
    sql += ` AND FECHAINICIO_NOTIFICACION >= $${i} AND FECHAFIN_NOTIFICACION <= $${
      i + 1
    }`;
    params.push(fechaInicio, fechaFin);
    i += 2;
  }

  sql += " ORDER BY FECHAINICIO_NOTIFICACION DESC";

  const result = await pool.query(sql, params);
  return result.rows;
}

// Obtener una notificación por ID
export async function fetchNotificacionById(id) {
  const result = await pool.query(
    "SELECT * FROM NOTIFICACION WHERE ID_NOTIFICACION = $1",
    [id]
  );
  return result.rows[0];
}

// Insertar una nueva notificación
export async function insertNotificacion(data) {
  const {
    nombre_notificacion,
    descripcion_notificacion,
    urgencia_notificacion,
    fechainicio_notificacion,
    fechafin_notificacion,
    horainicio_notificacion,
    horafin_notificacion,
    estado_notificacion = "A",
  } = data;

  if (
    !nombre_notificacion ||
    !descripcion_notificacion ||
    !fechainicio_notificacion ||
    !fechafin_notificacion ||
    !horainicio_notificacion ||
    !horafin_notificacion
  ) {
    throw { status: 400, message: "Campos obligatorios faltantes" };
  }

  const result = await pool.query(
    `INSERT INTO NOTIFICACION (
      NOMBRE_NOTIFICACION, DESCRIPCION_NOTIFICACION, URGENCIA_NOTIFICACION,
      FECHAINICIO_NOTIFICACION, FECHAFIN_NOTIFICACION,
      HORAINICIO_NOTIFICACION, HORAFIN_NOTIFICACION, ESTADO_NOTIFICACION
    ) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [
      nombre_notificacion,
      descripcion_notificacion,
      urgencia_notificacion,
      fechainicio_notificacion,
      fechafin_notificacion,
      horainicio_notificacion,
      horafin_notificacion,
      estado_notificacion,
    ]
  );

  return result.rows[0];
}

// Actualizar notificación
export async function updateNotificacion(id, data) {
  const {
    nombre_notificacion,
    descripcion_notificacion,
    urgencia_notificacion,
    fechainicio_notificacion,
    fechafin_notificacion,
    horainicio_notificacion,
    horafin_notificacion,
  } = data;

  if (
    !nombre_notificacion ||
    !descripcion_notificacion ||
    !fechainicio_notificacion ||
    !fechafin_notificacion ||
    !horainicio_notificacion ||
    !horafin_notificacion
  ) {
    throw { status: 400, message: "Campos obligatorios faltantes" };
  }

  const result = await pool.query(
    `UPDATE NOTIFICACION SET 
      NOMBRE_NOTIFICACION = $1,
      DESCRIPCION_NOTIFICACION = $2,
      URGENCIA_NOTIFICACION = $3,
      FECHAINICIO_NOTIFICACION = $4,
      FECHAFIN_NOTIFICACION = $5,
      HORAINICIO_NOTIFICACION = $6,
      HORAFIN_NOTIFICACION = $7
    WHERE ID_NOTIFICACION = $8
    RETURNING *`,
    [
      nombre_notificacion,
      descripcion_notificacion,
      urgencia_notificacion,
      fechainicio_notificacion,
      fechafin_notificacion,
      horainicio_notificacion,
      horafin_notificacion,
      id,
    ]
  );

  return result.rows[0];
}

// Inactivar notificación
export async function inactivarNotificacion(id) {
  const result = await pool.query(
    "UPDATE NOTIFICACION SET ESTADO_NOTIFICACION = 'I' WHERE ID_NOTIFICACION = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

// Cambio de nombre: marcarNotificacionCompletada -> completarNotificacion
export async function completarNotificacion(id) {
  const result = await pool.query(
    "UPDATE NOTIFICACION SET ESTADO_NOTIFICACION = 'C' WHERE ID_NOTIFICACION = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}

// Cambio de nombre: restaurarNotificacionPendiente -> restaurarNotificacion
export async function restaurarNotificacion(id) {
  const result = await pool.query(
    "UPDATE NOTIFICACION SET ESTADO_NOTIFICACION = 'P' WHERE ID_NOTIFICACION = $1 RETURNING *",
    [id]
  );
  return result.rows[0];
}
