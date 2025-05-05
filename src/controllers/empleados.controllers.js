import { pool } from "../db.js";
import bcrypt from "bcryptjs";

// Obtener todos los empleados con todos los datos de su usuario, sede y tipo de usuario
export const getEmpleadosConUsuario = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        e.*,
        u.*,
        t.descripcion_tipousuario,
        s.nombre_sede,
        sa.id_salario,
        sa.monto_salario,
        sa.tipopago_salario,
        sa.estado_salario
      FROM empleado e
      JOIN usuario u ON e.id_empleado = u.id_empleado_usuario
      JOIN tipousuario t ON u.id_tipousuario_usuario = t.id_tipousuario
      JOIN sede s ON e.id_sede_empleado = s.id_sede
      LEFT JOIN salario sa ON e.id_empleado = sa.id_empleado_salario AND sa.estado_salario = 'A'
    `);

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener empleados con usuario:", error);
    res.status(500).json({ error: "Error al obtener empleados" });
  }
};

export const crearEmpleado = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      id_empleado,
      id_sede_empleado,
      id_tipodocumento_empleado,
      nombre_empleado,
      telefono_empleado,
      cargo_empleado,
      email_empleado,
      email_usuario,
      telefono_usuario,
      id_tipousuario_usuario,
      monto_salario,
      tipopago_salario,
    } = req.body;

    await client.query("BEGIN");

    // ✅ Validar que el email de usuario no esté repetido
    const checkEmail = await client.query(
      `SELECT 1 FROM USUARIO WHERE EMAIL_USUARIO = $1`,
      [email_usuario]
    );

    if (checkEmail.rowCount > 0) {
      throw new Error("El correo electrónico del usuario ya está en uso.");
    }

    // 1. Insertar en EMPLEADO
    await client.query(
      `
      INSERT INTO EMPLEADO (
        ID_EMPLEADO,
        ID_SEDE_EMPLEADO,
        ID_TIPODOCUMENTO_EMPLEADO,
        NOMBRE_EMPLEADO,
        TELEFONO_EMPLEADO,
        CARGO_EMPLEADO,
        EMAIL_EMPLEADO
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      `,
      [
        id_empleado,
        id_sede_empleado,
        id_tipodocumento_empleado,
        nombre_empleado,
        telefono_empleado,
        cargo_empleado,
        email_empleado,
      ]
    );

    // 2. Hashear la contraseña (se usa la cédula como contraseña temporal)
    const contrasena_temporal = String(id_empleado);
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(contrasena_temporal, salt);

    // 3. Insertar en USUARIO con la contraseña hasheada
    await client.query(
      `
      INSERT INTO USUARIO (
        ID_EMPLEADO_USUARIO,
        CONTRASENA_USUARIO,
        EMAIL_USUARIO,
        TELEFONO_USUARIO,
        ID_TIPOUSUARIO_USUARIO,
        ESTADO_USUARIO
      )
      VALUES ($1, $2, $3, $4, $5, 'A')
      `,
      [
        id_empleado,
        hashedPassword,
        email_usuario,
        telefono_usuario,
        id_tipousuario_usuario,
      ]
    );

    // 4. Insertar en SALARIO
    await client.query(
      `
      INSERT INTO SALARIO (
        ID_EMPLEADO_SALARIO,
        MONTO_SALARIO,
        TIPOPAGO_SALARIO
      )
      VALUES ($1, $2, $3)
      `,
      [id_empleado, monto_salario, tipopago_salario]
    );

    await client.query("COMMIT");

    res.status(201).json({
      message: "Empleado creado exitosamente",
      contrasena: contrasena_temporal, // Solo para información temporal
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear empleado:", error);
    res.status(500).json({
      message: error.message.includes("ya está en uso")
        ? error.message
        : "Error al crear empleado",
      error: error.message,
    });
  } finally {
    client.release();
  }
};

export const eliminarEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    // Cambiar estado en EMPLEADO
    await pool.query(
      `UPDATE EMPLEADO SET ESTADO_EMPLEADO = 'I' WHERE ID_EMPLEADO = $1`,
      [id]
    );

    // Cambiar estado en USUARIO asociado
    await pool.query(
      `UPDATE USUARIO SET ESTADO_USUARIO = 'I' WHERE ID_EMPLEADO_USUARIO = $1`,
      [id]
    );

    // Cambiar estado en SALARIO asociado
    await pool.query(
      `UPDATE SALARIO SET ESTADO_SALARIO = 'I' WHERE ID_EMPLEADO_SALARIO = $1`,
      [id]
    );

    res.status(200).json({
      message: "Empleado eliminado (estado lógico) correctamente",
    });
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ message: "Error al eliminar empleado" });
  }
};

export const restaurarEmpleado = async (req, res) => {
  const { id } = req.params;

  try {
    // Cambiar estado en EMPLEADO
    await pool.query(
      `UPDATE EMPLEADO SET ESTADO_EMPLEADO = 'A' WHERE ID_EMPLEADO = $1`,
      [id]
    );

    // Cambiar estado en USUARIO asociado
    await pool.query(
      `UPDATE USUARIO SET ESTADO_USUARIO = 'A' WHERE ID_EMPLEADO_USUARIO = $1`,
      [id]
    );

    // Cambiar estado en SALARIO asociado
    await pool.query(
      `UPDATE SALARIO SET ESTADO_SALARIO = 'A' WHERE ID_EMPLEADO_SALARIO = $1`,
      [id]
    );

    res.status(200).json({
      message: "Empleado restaurado correctamente",
    });
  } catch (error) {
    console.error("Error al restaurar empleado:", error);
    res.status(500).json({ message: "Error al restaurar empleado" });
  }
};

// Obtener los detalles de un empleado específico
export const getEmpleadoPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `
        SELECT 
          e.*,
          u.*,
          t.descripcion_tipousuario,
          s.nombre_sede,
          sa.id_salario,
          sa.monto_salario,
          sa.tipopago_salario,
          sa.estado_salario
        FROM empleado e
        JOIN usuario u ON e.id_empleado = u.id_empleado_usuario
        JOIN tipousuario t ON u.id_tipousuario_usuario = t.id_tipousuario
        JOIN sede s ON e.id_sede_empleado = s.id_sede
        LEFT JOIN salario sa ON e.id_empleado = sa.id_empleado_salario AND sa.estado_salario = 'A'
        WHERE e.id_empleado = $1
      `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Empleado no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener el empleado por ID:", error);
    res.status(500).json({ error: "Error al obtener empleado" });
  }
};

export const actualizarEmpleado = async (req, res) => {
  const id = req.params.id;
  const {
    id_sede_empleado,
    nombre_empleado,
    telefono_empleado,
    cargo_empleado,
    email_empleado,
    email_usuario,
    telefono_usuario,
    id_tipousuario_usuario,
    monto_salario,
    tipopago_salario,
  } = req.body;

  try {
    await pool.query("BEGIN");

    // Actualizar EMPLEADO
    await pool.query(
      `UPDATE EMPLEADO
           SET id_sede_empleado = $1,
               nombre_empleado = $2,
               telefono_empleado = $3,
               cargo_empleado = $4,
               email_empleado = $5
           WHERE id_empleado = $6`,
      [
        id_sede_empleado,
        nombre_empleado,
        telefono_empleado,
        cargo_empleado,
        email_empleado,
        id,
      ]
    );

    console.log("Actualizando salario con los siguientes valores:");
    console.log("Monto salario:", monto_salario);
    console.log("Tipo de pago:", tipopago_salario);
    console.log("ID del empleado:", id);
    // Actualizar USUARIO (sin estado_usuario)
    await pool.query(
      `UPDATE USUARIO
           SET email_usuario = $1,
               telefono_usuario = $2,
               id_tipousuario_usuario = $3
           WHERE id_empleado_usuario = $4`,
      [email_usuario, telefono_usuario, id_tipousuario_usuario, id]
    );

    // Actualizar SALARIO
    await pool.query(
      `UPDATE SALARIO
           SET monto_salario = $1,
               tipopago_salario = $2
           WHERE id_empleado_salario = $3`,
      [monto_salario, tipopago_salario, id]
    );

    await pool.query("COMMIT");
    res.json({ message: "Empleado actualizado correctamente." });
  } catch (error) {
    await pool.query("ROLLBACK");
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ error: "Error al actualizar el empleado." });
  }
};
