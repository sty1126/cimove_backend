import { pool } from "../../db.js";

// Obtener todos los clientes con detalles completos
export const obtenerClientes = async () => {
  const result = await pool.query(`SELECT * FROM CLIENTE WHERE ESTADO_CLIENTE = 'A'`);
  return result.rows;
};

// Obtener un cliente por ID con detalles completos
export const obtenerClientePorId = async (id, res) => {
  const result = await pool.query(`SELECT * FROM CLIENTE WHERE ID_CLIENTE = $1`, [id]);
  if (result.rows.length === 0) {
    throw new Error("Cliente no encontrado");
  }
  return result.rows[0];
};

// Obtener solo clientes naturales con detalles
export const obtenerClientesNaturales = async () => {
  const result = await pool.query(`SELECT * FROM CLIENTENATURAL`);
  return result.rows;
};

// Obtener solo clientes jurídicos con detalles
export const obtenerClientesJuridicos = async () => {
  const result = await pool.query(`SELECT * FROM CLIENTEJURIDICO`);
  return result.rows;
};

// Obtener todos los tipos de cliente
export const obtenerTiposCliente = async () => {
  const result = await pool.query(`SELECT * FROM TIPOCLIENTE`);
  return result.rows;
};

export const crearCliente = async (data) => {
  const {
    id_cliente,
    tipo_cliente,
    id_tipodocumento_cliente,
    nombre_cliente,
    apellido_cliente,
    razon_social_cliente,
    telefono_cliente,
    correo_cliente,
    direccion_cliente,
  } = data;

  await pool.query(
    `INSERT INTO CLIENTE (
      ID_CLIENTE,
      ID_TIPOCLIENTE_CLIENTE,
      ID_TIPODOCUMENTO_CLIENTE,
      NOMBRE_CLIENTE,
      APELLIDO_CLIENTE,
      RAZONSOCIAL_CLIENTE,
      TELEFONO_CLIENTE,
      CORREO_CLIENTE,
      DIRECCION_CLIENTE,
      ESTADO_CLIENTE
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'A')`,
    [
      id_cliente,
      tipo_cliente,
      id_tipodocumento_cliente,
      nombre_cliente,
      apellido_cliente,
      razon_social_cliente,
      telefono_cliente,
      correo_cliente,
      direccion_cliente,
    ]
  );
};

export const actualizarCliente = async (id, data) => {
  const {
    id_tipodocumento_cliente,
    nombre_cliente,
    apellido_cliente,
    razon_social_cliente,
    telefono_cliente,
    correo_cliente,
    direccion_cliente,
  } = data;

  await pool.query(
    `UPDATE CLIENTE SET 
      ID_TIPODOCUMENTO_CLIENTE = $1,
      NOMBRE_CLIENTE = $2,
      APELLIDO_CLIENTE = $3,
      RAZONSOCIAL_CLIENTE = $4,
      TELEFONO_CLIENTE = $5,
      CORREO_CLIENTE = $6,
      DIRECCION_CLIENTE = $7
    WHERE ID_CLIENTE = $8`,
    [
      id_tipodocumento_cliente,
      nombre_cliente,
      apellido_cliente,
      razon_social_cliente,
      telefono_cliente,
      correo_cliente,
      direccion_cliente,
      id,
    ]
  );
};

export const eliminarCliente = async (id) => {
  await pool.query(`UPDATE CLIENTE SET ESTADO_CLIENTE = 'I' WHERE ID_CLIENTE = $1`, [id]);
};

export const obtenerClientesFormateados = async () => {
  const result = await pool.query(`
    SELECT 
      ID_CLIENTE,
      COALESCE(RAZONSOCIAL_CLIENTE, NOMBRE_CLIENTE || ' ' || APELLIDO_CLIENTE) AS NOMBRE_CLIENTE
    FROM CLIENTE
    WHERE ESTADO_CLIENTE = 'A'
  `);
  return result.rows;
};

// Obtener clientes por ID de sede
export const obtenerClientesPorSede = async (idSede) => {
  const result = await pool.query(`
    SELECT * FROM CLIENTE 
    WHERE ID_SEDE_CLIENTE = $1 AND ESTADO_CLIENTE = 'A'
  `, [idSede]);
  return result.rows;
};
