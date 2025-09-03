import { pool } from "../../db.js";

export const insertarUsuario = async ({
  id_empleado_usuario,
  contrasena_usuario,
  email_usuario,
  telefono_usuario,
  id_tipousuario_usuario,
}) => {
  const result = await pool.query(
    `INSERT INTO USUARIO (
      ID_EMPLEADO_USUARIO,
      CONTRASENA_USUARIO,
      EMAIL_USUARIO,
      TELEFONO_USUARIO,
      ID_TIPOUSUARIO_USUARIO,
      ESTADO_USUARIO
    ) VALUES ($1, $2, $3, $4, $5, 'A') RETURNING *`,
    [id_empleado_usuario, contrasena_usuario, email_usuario, telefono_usuario, id_tipousuario_usuario]
  );
  return result.rows[0];
};

export const obtenerUsuarioPorEmail = async (email) => {
  const result = await pool.query(
    `SELECT 
      u.id_empleado_usuario,
      u.id_tipousuario_usuario,
      u.email_usuario,
      u.contrasena_usuario,
      e.id_sede_empleado
     FROM USUARIO u
     INNER JOIN EMPLEADO e ON u.id_empleado_usuario = e.id_empleado
     WHERE u.email_usuario = $1 AND u.estado_usuario = 'A'`,
    [email]
  );
  return result.rows[0];
};

export const obtenerUsuarioPorEmailSimple = async (email) => {
  const result = await pool.query(
    `SELECT contrasena_usuario
     FROM USUARIO
     WHERE email_usuario = $1 AND estado_usuario = 'A'`,
    [email]
  );
  return result.rows[0];
};

export const actualizarPassword = async (email, nuevaPasswordHasheada) => {
  await pool.query(
    `UPDATE USUARIO SET contrasena_usuario = $1 WHERE email_usuario = $2`,
    [nuevaPasswordHasheada, email]
  );
};

//Para recuperar la contraseña
export const savePasswordResetToken = async (userId, token, expiry) => {
  await pool.query(
    `INSERT INTO PASSWORDRESET (ID_EMPLEADO_USUARIO, TOKEN, TOKEN_EXPIRADO) VALUES ($1, $2, $3)`,
    [userId, token, expiry]
  );
};

export const findUserByToken = async (token) => {
  const result = await pool.query(
    `SELECT u.* FROM USUARIO u
     INNER JOIN PASSWORDRESET prt ON u.ID_EMPLEADO_USUARIO = prt.ID_EMPLEADO_USUARIO
     WHERE prt.TOKEN = $1 AND prt.TOKEN_EXPIRADO > NOW() AND u.ESTADO_USUARIO = 'A'`,
    [token]
  );
  return result.rows[0];
};

export const updatePasswordByUserId = async (userId, newHashedPassword) => {
  await pool.query(
    `UPDATE USUARIO SET CONTRASENA_USUARIO = $1 WHERE ID_EMPLEADO_USUARIO = $2`,
    [newHashedPassword, userId]
  );
};

export const invalidateToken = async (token) => {
  await pool.query(
    `DELETE FROM PASSWORDRESET WHERE TOKEN = $1`,
    [token]
  );
};
