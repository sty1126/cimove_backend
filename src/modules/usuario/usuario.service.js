import * as repo from "./usuario.repository.js";
import bcrypt from "bcryptjs";

export const createUsuario = async (data) => {
  const hashed = await bcrypt.hash(data.contrasena_usuario, await bcrypt.genSalt(10));
  return await repo.insertarUsuario({ ...data, contrasena_usuario: hashed });
};

export const checkPassword = async (email, passInput) => {
  const usuario = await repo.obtenerUsuarioPorEmail(email);
  if (!usuario || !usuario.contrasena_usuario) return null;

  const isMatch = await bcrypt.compare(passInput, usuario.contrasena_usuario);
  return isMatch
    ? {
        id: usuario.id_empleado_usuario,
        tipo_usuario: usuario.id_tipousuario_usuario,
        sede: usuario.id_sede_empleado,
        email: usuario.email_usuario,
      }
    : false;
};

export const updatePassword = async ({ email_usuario, contrasena_actual, contrasena_nueva }) => {
  const usuario = await repo.obtenerUsuarioPorEmailSimple(email_usuario);
  if (!usuario) throw new Error("Usuario no encontrado o inactivo");

  const isMatch = await bcrypt.compare(contrasena_actual, usuario.contrasena_usuario);
  if (!isMatch) throw new Error("Contraseña actual incorrecta");

  const hashedNewPassword = await bcrypt.hash(contrasena_nueva, await bcrypt.genSalt(10));
  await repo.actualizarPassword(email_usuario, hashedNewPassword);
};
