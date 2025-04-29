import { pool } from "../db.js";
import bcrypt from "bcrypt";

// Crear un nuevo usuario con la contraseña hasheada
export const createUsuario = async (req, res) => {
  try {
    const {
      id_empleado_usuario,
      contrasena_usuario,
      email_usuario,
      telefono_usuario,
      id_tipousuario_usuario,
    } = req.body;

    // Validación de campos obligatorios
    if (
      !id_empleado_usuario ||
      !contrasena_usuario ||
      !email_usuario ||
      !id_tipousuario_usuario
    ) {
      return res.status(400).json({
        error: "Todos los campos obligatorios deben ser proporcionados",
      });
    }

    // Hashear la contraseña antes de almacenarla
    const salt = await bcrypt.genSalt(10); // Genera un "salt"
    const hashedPassword = await bcrypt.hash(contrasena_usuario, salt); // Hashea la contraseña

    // Insertar el nuevo usuario con la contraseña hasheada
    const result = await pool.query(
      "INSERT INTO USUARIO (ID_EMPLEADO_USUARIO, CONTRASENA_USUARIO, EMAIL_USUARIO, TELEFONO_USUARIO, ID_TIPOUSUARIO_USUARIO, ESTADO_USUARIO) VALUES ($1, $2, $3, $4, $5, 'A') RETURNING *",
      [
        id_empleado_usuario,
        hashedPassword,
        email_usuario,
        telefono_usuario,
        id_tipousuario_usuario,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Función para verificar la contraseña
export const checkPassword = async (email_usuario, contrasena_ingresada) => {
  try {
    const result = await pool.query(
      `SELECT 
          usuario.id_empleado_usuario,
          usuario.id_tipousuario_usuario, 
          empleado.id_sede_empleado, 
          usuario.email_usuario, 
          usuario.contrasena_usuario
        FROM usuario
        INNER JOIN empleado ON usuario.id_empleado_usuario = empleado.id_empleado
        WHERE usuario.email_usuario = $1
          AND usuario.estado_usuario = 'A';`,
      [email_usuario]
    );

    if (result.rowCount === 0) {
      return null; // Usuario no encontrado
    }

    const {
      id_empleado_usuario,
      id_tipousuario_usuario,
      id_sede_empleado,
      email_usuario: email_db,
      contrasena_usuario,
    } = result.rows[0];

    if (!contrasena_usuario) {
      console.error("El hash almacenado no existe");
      return false;
    }

    const isMatch = await bcrypt.compare(
      contrasena_ingresada,
      contrasena_usuario
    );

    if (isMatch) {
      // Devuelve toda la info que necesitas
      return {
        id: id_empleado_usuario,
        tipo_usuario: id_tipousuario_usuario,
        sede: id_sede_empleado,
        email: email_db,
      };
    } else {
      return false; // Contraseña incorrecta
    }
  } catch (error) {
    console.error("Error al comprobar la contraseña:", error);
    throw new Error("Error al verificar la contraseña");
  }
};

export const updatePassword = async (req, res) => {
  const { email_usuario, contrasena_actual, contrasena_nueva } = req.body;

  // Validación de campos
  if (!email_usuario || !contrasena_actual || !contrasena_nueva) {
    return res.status(400).json({ error: "Todos los campos son obligatorios" });
  }

  try {
    // Buscar el usuario por email
    const result = await pool.query(
      "SELECT CONTRASENA_USUARIO FROM USUARIO WHERE EMAIL_USUARIO = $1 AND ESTADO_USUARIO = 'A'",
      [email_usuario]
    );

    if (result.rowCount === 0) {
      return res
        .status(404)
        .json({ error: "Usuario no encontrado o inactivo" });
    }

    const hashedPassword = result.rows[0].CONTRASENA_USUARIO;

    console.log("Hashed Password desde la base de datos:", hashedPassword); // Agrega esto para ver qué obtienes

    if (!hashedPassword) {
      throw new Error(
        "Contraseña no encontrada o está vacía en la base de datos."
      );
    }

    // Verificar que la contraseña actual coincida
    const isMatch = await bcrypt.compare(contrasena_actual, hashedPassword);

    if (!isMatch) {
      return res.status(401).json({ error: "Contraseña actual incorrecta" });
    }

    // Hashear la nueva contraseña
    const salt = await bcrypt.genSalt(10); // Genera un "salt"
    const hashedNewPassword = await bcrypt.hash(contrasena_nueva, salt); // Hashea la nueva contraseña

    // Actualizar la contraseña en la base de datos
    await pool.query(
      "UPDATE USUARIO SET CONTRASENA_USUARIO = $1 WHERE EMAIL_USUARIO = $2",
      [hashedNewPassword, email_usuario]
    );

    res.json({ message: "Contraseña actualizada correctamente" });
  } catch (error) {
    console.error("Error al actualizar la contraseña:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
