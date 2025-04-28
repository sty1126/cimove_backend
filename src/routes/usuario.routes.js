import express from "express";
import {
  createUsuario,
  checkPassword,
  updatePassword,
} from "../controllers/usuario.controllers.js";

const router = express.Router();

// Ruta para crear un nuevo usuario
router.post("/create", createUsuario);

// Ruta para comprobar la contraseña de un usuario (por email)
router.post("/check-password", async (req, res) => {
  const { email_usuario, contrasena_ingresada } = req.body;

  if (!email_usuario || !contrasena_ingresada) {
    return res
      .status(400)
      .json({ error: "Email y contraseña son obligatorios" });
  }

  try {
    const passwordValidationResult = await checkPassword(
      email_usuario,
      contrasena_ingresada
    );

    if (passwordValidationResult === null) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o inactivo" });
    }

    if (passwordValidationResult) {
      return res.json({
        message: "Contraseña correcta",
        user: passwordValidationResult,
      });
    } else {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }
  } catch (error) {
    console.error("Error al verificar la contraseña:", error);
    return res.status(500).json({ error: "Error al verificar la contraseña" });
  }
});

// Ruta para actualizar la contraseña de un usuario
router.put("/update-password", updatePassword);

export default router;
