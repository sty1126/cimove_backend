import { pool } from "../../db.js";

// Get para todos los clientes
export const obtenerClientes = async () => {
  const result = await pool.query(`
    SELECT 
      C.*,
      TC.descripcion_tipocliente,
      CN.nombre_cliente, CN.apellido_cliente, CN.fechanacimiento_cliente, CN.genero_cliente,
      CJ.razonsocial_cliente, CJ.nombrecomercial_cliente, CJ.representante_cliente, CJ.digitoverificacion_cliente
    FROM CLIENTE C
    JOIN TIPOCLIENTE TC ON TC.id_tipocliente = C.id_tipocliente_cliente
    LEFT JOIN CLIENTENATURAL CN ON CN.id_cliente = C.id_cliente
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.id_cliente = C.id_cliente
    ORDER BY C.id_cliente;
  `);
  return result.rows;
};

// Obtener clientes por id
export const obtenerClientePorId = async (id) => {
  const result = await pool.query(
    `
    SELECT 
      C.*,
      TC.descripcion_tipocliente,
      CN.nombre_cliente, CN.apellido_cliente, CN.fechanacimiento_cliente, CN.genero_cliente,
      CJ.razonsocial_cliente, CJ.nombrecomercial_cliente, CJ.representante_cliente, CJ.digitoverificacion_cliente
    FROM CLIENTE C
    JOIN TIPOCLIENTE TC ON TC.id_tipocliente = C.id_tipocliente_cliente
    LEFT JOIN CLIENTENATURAL CN ON CN.id_cliente = C.id_cliente
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.id_cliente = C.id_cliente
    WHERE C.id_cliente = $1;
  `,
    [id]
  );
  return result.rows[0];
};


export const findClientesNaturales = async () => {
  const result = await pool.query(`
    SELECT 
      C.*,
      TC.descripcion_tipocliente,
      CN.nombre_cliente, CN.apellido_cliente, CN.fechanacimiento_cliente, CN.genero_cliente,
      CJ.razonsocial_cliente, CJ.nombrecomercial_cliente, CJ.representante_cliente, CJ.digitoverificacion_cliente
    FROM CLIENTE C
    JOIN TIPOCLIENTE TC ON TC.id_tipocliente = C.id_tipocliente_cliente
    LEFT JOIN CLIENTENATURAL CN ON CN.id_cliente = C.id_cliente
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.id_cliente = C.id_cliente
    WHERE C.id_tipocliente_cliente = 1
    ORDER BY C.id_cliente;
  `);
  return result.rows;
};


export const findClientesJuridicos = async () => {
  const result = await pool.query(`
    SELECT 
      C.*,
      TC.descripcion_tipocliente,
      CN.nombre_cliente, CN.apellido_cliente, CN.fechanacimiento_cliente, CN.genero_cliente,
      CJ.razonsocial_cliente, CJ.nombrecomercial_cliente, CJ.representante_cliente, CJ.digitoverificacion_cliente
    FROM CLIENTE C
    JOIN TIPOCLIENTE TC ON TC.id_tipocliente = C.id_tipocliente_cliente
    LEFT JOIN CLIENTENATURAL CN ON CN.id_cliente = C.id_cliente
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.id_cliente = C.id_cliente
    WHERE C.id_tipocliente_cliente = 2
    ORDER BY C.id_cliente;
  `);
  return result.rows;
};


export const findTiposCliente = async () => {
  const result = await pool.query(`
    SELECT id_tipocliente, descripcion_tipocliente
    FROM TIPOCLIENTE
    ORDER BY id_tipocliente;
  `);
  return result.rows;
};


export const findClientesFormateados = async () => {
  const result = await pool.query(`
    SELECT 
      C.*,
      TC.descripcion_tipocliente,
      CN.nombre_cliente, CN.apellido_cliente, CN.fechanacimiento_cliente, CN.genero_cliente,
      CJ.razonsocial_cliente, CJ.nombrecomercial_cliente, CJ.representante_cliente, CJ.digitoverificacion_cliente
    FROM CLIENTE C
    JOIN TIPOCLIENTE TC ON TC.id_tipocliente = C.id_tipocliente_cliente
    LEFT JOIN CLIENTENATURAL CN ON CN.id_cliente = C.id_cliente
    LEFT JOIN CLIENTEJURIDICO CJ ON CJ.id_cliente = C.id_cliente
    ORDER BY C.id_cliente;
  `);
  return result.rows;
};

//Crear cliente
export const crearCliente = async (clienteData) => {
  
  const {
    id_cliente,
    id_tipodocumento_cliente,
    id_tipocliente_cliente,
    telefono_cliente,
    id_sede_cliente,
    email_cliente,
    direccion_cliente,
    barrio_cliente,
    codigopostal_cliente,
    estado_cliente = 'A',
    nombre_cliente,
    apellido_cliente,
    fechanacimiento_cliente,
    genero_cliente,
    razonsocial_cliente,
    nombrecomercial_cliente,
    representante_cliente,
    digitoverificacion_cliente,
  } = clienteData;

  const client = await pool.connect(); 

  try {
    await client.query("BEGIN");

    //console.log("📦 Insertando en tabla CLIENTE...");
    // Insertar en CLIENTE
    await client.query(
      `
      INSERT INTO CLIENTE (
        id_cliente, id_tipodocumento_cliente, id_tipocliente_cliente,
        telefono_cliente, id_sede_cliente, email_cliente,
        direccion_cliente, barrio_cliente, codigopostal_cliente, estado_cliente
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `,
      [
        id_cliente,
        id_tipodocumento_cliente,
        id_tipocliente_cliente,
        telefono_cliente,
        id_sede_cliente,
        email_cliente,
        direccion_cliente,
        barrio_cliente,
        codigopostal_cliente,
        estado_cliente,
      ]
    );
    console.log("✅ INSERT en CLIENTE exitoso");

    
    if (id_tipocliente_cliente == 1) {

      await client.query(
        `
        INSERT INTO CLIENTENATURAL (
          id_cliente, nombre_cliente, apellido_cliente, 
          fechanacimiento_cliente, genero_cliente
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          id_cliente,
          nombre_cliente,
          apellido_cliente,
          fechanacimiento_cliente,
          genero_cliente,
        ]
      );
      console.log("✅ INSERT en CLIENTENATURAL exitoso");
    } else if (id_tipocliente_cliente == 2) {
     
      await client.query(
        `
        INSERT INTO CLIENTEJURIDICO (
          id_cliente, razonsocial_cliente, nombrecomercial_cliente, 
          representante_cliente, digitoverificacion_cliente
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          id_cliente,
          razonsocial_cliente,
          nombrecomercial_cliente,
          representante_cliente,
          digitoverificacion_cliente,
        ]
      );
      console.log("✅ INSERT en CLIENTEJURIDICO exitoso")
    }

    await client.query("COMMIT");
    
    return { success: true, id: id_cliente };
    
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("❌ ERROR en repository crearCliente:", error.message);
    console.error("Stack:", error.stack);
    throw error;
  } finally {
    client.release(); 
  }
};

// Actualizar cliente
export const actualizarCliente = async (id, clienteData) => {
  const {
    telefono_cliente,
    id_sede_cliente,
    email_cliente,
    direccion_cliente,
    barrio_cliente,
    codigopostal_cliente,
    estado_cliente = 'A', // Valor por defecto
    nombre_cliente,
    apellido_cliente,
    fechanacimiento_cliente,
    genero_cliente,
    razonsocial_cliente,
    nombrecomercial_cliente,
    representante_cliente,
    digitoverificacion_cliente,
    id_tipocliente_cliente,
  } = clienteData;

  try {
    await pool.query("BEGIN");

    
    await pool.query(
      `
      UPDATE CLIENTE SET 
        telefono_cliente=$1,
        id_sede_cliente=$2,
        email_cliente=$3,
        direccion_cliente=$4,
        barrio_cliente=$5,
        codigopostal_cliente=$6,
        estado_cliente=$7
      WHERE id_cliente=$8
      `,
      [
        telefono_cliente,
        id_sede_cliente,
        email_cliente,
        direccion_cliente,
        barrio_cliente,
        codigopostal_cliente,
        estado_cliente,
        id,
      ]
    );

    if (id_tipocliente_cliente == 1) {
      await pool.query(
        `
        UPDATE CLIENTENATURAL SET 
          nombre_cliente=$1, apellido_cliente=$2, fechanacimiento_cliente=$3, genero_cliente=$4
        WHERE id_cliente=$5
        `,
        [nombre_cliente, apellido_cliente, fechanacimiento_cliente, genero_cliente, id]
      );
    } else if (id_tipocliente_cliente == 2) {
      await pool.query(
        `
        UPDATE CLIENTEJURIDICO SET 
          razonsocial_cliente=$1, nombrecomercial_cliente=$2, representante_cliente=$3, digitoverificacion_cliente=$4
        WHERE id_cliente=$5
        `,
        [
          razonsocial_cliente,
          nombrecomercial_cliente,
          representante_cliente,
          digitoverificacion_cliente,
          id,
        ]
      );
    }

    await pool.query("COMMIT");
    return { success: true, message: "Cliente actualizado exitosamente" };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};

//Eliminar un cliente
export const eliminarCliente = async (id) => {
  try {
    await pool.query("BEGIN");

    await pool.query("DELETE FROM CLIENTENATURAL WHERE id_cliente=$1", [id]);
    await pool.query("DELETE FROM CLIENTEJURIDICO WHERE id_cliente=$1", [id]);
    await pool.query("DELETE FROM CLIENTE WHERE id_cliente=$1", [id]);

    await pool.query("COMMIT");
    return { success: true, message: "Cliente eliminado exitosamente" };
  } catch (error) {
    await pool.query("ROLLBACK");
    throw error;
  }
};