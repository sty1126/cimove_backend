import { pool } from "../../db.js";
import bcrypt from "bcryptjs";

// Obtener todos los empleados con sus datos
export const obtenerEmpleadosConUsuario = async () => {
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
  return result.rows;
};

export const crearEmpleado = async (data) => {
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
    } = data;

    await client.query("BEGIN");
 // ✅ Validar que el email de usuario no esté repetido
    const check = await client.query(
      `SELECT 1 FROM USUARIO WHERE EMAIL_USUARIO = $1`,
      [email_usuario]
    );

    if (check.rowCount > 0) {
      throw new Error("El correo electrónico ya está en uso");
    }
    //Insertar en EMPLEADO
    await client.query(`
      INSERT INTO EMPLEADO (
        ID_EMPLEADO, ID_SEDE_EMPLEADO, ID_TIPODOCUMENTO_EMPLEADO,
        NOMBRE_EMPLEADO, TELEFONO_EMPLEADO, CARGO_EMPLEADO, EMAIL_EMPLEADO
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7)
    `, [id_empleado, id_sede_empleado, id_tipodocumento_empleado, nombre_empleado, telefono_empleado, cargo_empleado, email_empleado]);

    // Hashear la contraseña
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(String(id_empleado), salt);

    // Insertar un usuario con la contraseña hasheada    
    await client.query(`
      INSERT INTO USUARIO (
        ID_EMPLEADO_USUARIO, CONTRASENA_USUARIO, EMAIL_USUARIO,
        TELEFONO_USUARIO, ID_TIPOUSUARIO_USUARIO, ESTADO_USUARIO
      )
      VALUES ($1,$2,$3,$4,$5,'A')
    `, [id_empleado, hashedPassword, email_usuario, telefono_usuario, id_tipousuario_usuario]);    
    
    //Insertar en SALARIO    
    await client.query(`
      INSERT INTO SALARIO (
        ID_EMPLEADO_SALARIO, MONTO_SALARIO, TIPOPAGO_SALARIO
      )
      VALUES ($1, $2, $3)
    `, [id_empleado, monto_salario, tipopago_salario]);

    await client.query("COMMIT");
    return { message: "Empleado creado exitosamente", contrasena: String(id_empleado) };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

export const obtenerEmpleadoPorId = async (id) => {
  const result = await pool.query(`
    SELECT 
      e.*, u.*, t.descripcion_tipousuario, s.nombre_sede,
      sa.id_salario, sa.monto_salario, sa.tipopago_salario, sa.estado_salario
    FROM empleado e
    JOIN usuario u ON e.id_empleado = u.id_empleado_usuario
    JOIN tipousuario t ON u.id_tipousuario_usuario = t.id_tipousuario
    JOIN sede s ON e.id_sede_empleado = s.id_sede
    LEFT JOIN salario sa ON e.id_empleado = sa.id_empleado_salario AND sa.estado_salario = 'A'
    WHERE e.id_empleado = $1
  `, [id]);

  if (result.rows.length === 0) {
    throw new Error("Empleado no encontrado");
  }

  return result.rows[0];
};

export const eliminarEmpleado = async (id) => {
  //Cambiar estado en EMPLEADO
  await pool.query(`UPDATE EMPLEADO SET ESTADO_EMPLEADO = 'I' WHERE ID_EMPLEADO = $1`, [id]);
  //Cambiar estado en USUARIO asociado
  await pool.query(`UPDATE USUARIO SET ESTADO_USUARIO = 'I' WHERE ID_EMPLEADO_USUARIO = $1`, [id]);
  //Cambiar estado en SALARIO asociado
  await pool.query(`UPDATE SALARIO SET ESTADO_SALARIO = 'I' WHERE ID_EMPLEADO_SALARIO = $1`, [id]);
};

export const restaurarEmpleado = async (id) => {
  //Cambiar estado en EMPLEADO
  await pool.query(`UPDATE EMPLEADO SET ESTADO_EMPLEADO = 'A' WHERE ID_EMPLEADO = $1`, [id]);
  // Cambiar estado en USUARIO asociado
  await pool.query(`UPDATE USUARIO SET ESTADO_USUARIO = 'A' WHERE ID_EMPLEADO_USUARIO = $1`, [id]);
  // Cambiar estado en SALARIO asociado
  await pool.query(`UPDATE SALARIO SET ESTADO_SALARIO = 'A' WHERE ID_EMPLEADO_SALARIO = $1`, [id]);
};

export const actualizarEmpleado = async (id, data) => {
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
  } = data;

  await pool.query("BEGIN");
  try {
    //Actualizar EMPLEADO
    await pool.query(`
      UPDATE EMPLEADO SET 
        id_sede_empleado = $1,
        nombre_empleado = $2,
        telefono_empleado = $3,
        cargo_empleado = $4,
        email_empleado = $5
      WHERE id_empleado = $6
    `, [id_sede_empleado, nombre_empleado, telefono_empleado, cargo_empleado, email_empleado, id]);

    //Actualizar USUARIO (sin estado_usuario)
    await pool.query(`
      UPDATE USUARIO SET 
        email_usuario = $1,
        telefono_usuario = $2,
        id_tipousuario_usuario = $3
      WHERE id_empleado_usuario = $4
    `, [email_usuario, telefono_usuario, id_tipousuario_usuario, id]);
    
    //Actualizar salario
    await pool.query(`
      UPDATE SALARIO SET 
        monto_salario = $1,
        tipopago_salario = $2
      WHERE id_empleado_salario = $3
    `, [monto_salario, tipopago_salario, id]);

    await pool.query("COMMIT");
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};
