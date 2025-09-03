import * as service from "./usuario.service.js";

export const createUsuarioController = async (req, res) => {
  try {
    const user = await service.createUsuario(req.body);
    res.status(201).json(user);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const checkPasswordController = async (req, res) => {
  const { email_usuario, contrasena_ingresada } = req.body;

  if (!email_usuario || !contrasena_ingresada) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const result = await service.checkPassword(email_usuario, contrasena_ingresada);

    if (result === null) {
      return res.status(404).json({ error: "Usuario no encontrado o inactivo" });
    }

    if (result === false) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ message: "Contraseña correcta", user: result });
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const updatePasswordController = async (req, res) => {
  try {
    await service.updatePassword(req.body);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error.message);
    res.status(400).json({ error: error.message });
  }
};

export const requestPasswordResetController = async (req, res) => {
  try {
    const { email_usuario } = req.body;
    await service.requestPasswordReset(email_usuario);
    res.json({ message: "Si el correo electrónico existe, se ha enviado un enlace de recuperación." });
  } catch (error) {
    console.error("Error en la solicitud de restablecimiento:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const resetPasswordController = async (req, res) => {
  try {
    await service.resetPasswordWithToken(req.body);
    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al restablecer la contraseña:", error.message);
    res.status(400).json({ error: error.message });
  }
};
