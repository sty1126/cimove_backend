import { pool } from "../db.js";

// Obtener todos los clientes con detalles completos
export const getClientes = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        C.*, TC.descripcion_tipocliente,
        CN.NOMBRE_CLIENTE, CN.APELLIDO_CLIENTE, CN.FECHANACIMIENTO_CLIENTE, CN.GENERO_CLIENTE,
        CJ.RAZONSOCIAL_CLIENTE, CJ.NOMBRECOMERCIAL_CLIENTE, CJ.REPRESENTANTE_CLIENTE, CJ.DIGITOVERIFICACION_CLIENTE
      FROM CLIENTE C
      JOIN TIPOCLIENTE TC ON C.ID_TIPOCLIENTE_CLIENTE = TC.ID_TIPOCLIENTE
      LEFT JOIN CLIENTENATURAL CN ON C.ID_CLIENTE = CN.ID_CLIENTE
      LEFT JOIN CLIENTEJURIDICO CJ ON C.ID_CLIENTE = CJ.ID_CLIENTE
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener solo clientes naturales con detalles
export const getClientesNaturales = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT C.*, TC.descripcion_tipocliente, CN.*
      FROM CLIENTE C
      JOIN TIPOCLIENTE TC ON C.ID_TIPOCLIENTE_CLIENTE = TC.ID_TIPOCLIENTE
      JOIN CLIENTENATURAL CN ON C.ID_CLIENTE = CN.ID_CLIENTE
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes naturales:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener solo clientes jurídicos con detalles
export const getClientesJuridicos = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT C.*, TC.descripcion_tipocliente, CJ.*
      FROM CLIENTE C
      JOIN TIPOCLIENTE TC ON C.ID_TIPOCLIENTE_CLIENTE = TC.ID_TIPOCLIENTE
      JOIN CLIENTEJURIDICO CJ ON C.ID_CLIENTE = CJ.ID_CLIENTE
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes jurídicos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un cliente por ID con detalles completos
export const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `
      SELECT 
        C.*, TC.descripcion_tipocliente,
        CN.NOMBRE_CLIENTE, CN.APELLIDO_CLIENTE, CN.FECHANACIMIENTO_CLIENTE, CN.GENERO_CLIENTE,
        CJ.RAZONSOCIAL_CLIENTE, CJ.NOMBRECOMERCIAL_CLIENTE, CJ.REPRESENTANTE_CLIENTE, CJ.DIGITOVERIFICACION_CLIENTE
      FROM CLIENTE C
      JOIN TIPOCLIENTE TC ON C.ID_TIPOCLIENTE_CLIENTE = TC.ID_TIPOCLIENTE
      LEFT JOIN CLIENTENATURAL CN ON C.ID_CLIENTE = CN.ID_CLIENTE
      LEFT JOIN CLIENTEJURIDICO CJ ON C.ID_CLIENTE = CJ.ID_CLIENTE
      WHERE C.ID_CLIENTE = $1
    `,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los tipos de cliente
export const getTiposCliente = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM TIPOCLIENTE");
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos de cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear un nuevo cliente
export const createCliente = async (req, res) => {
  try {
    const { id_tipo_cliente, datos } = req.body;
    const result = await pool.query(
      "INSERT INTO CLIENTE (ID_TIPOCLIENTE_CLIENTE) VALUES ($1) RETURNING ID_CLIENTE",
      [id_tipo_cliente]
    );
    const id_cliente = result.rows[0].id_cliente;

    if (id_tipo_cliente === 1) {
      await pool.query(
        "INSERT INTO CLIENTENATURAL (ID_CLIENTE, NOMBRE_CLIENTE, APELLIDO_CLIENTE, FECHANACIMIENTO_CLIENTE, GENERO_CLIENTE) VALUES ($1, $2, $3, $4, $5)",
        [
          id_cliente,
          datos.nombre,
          datos.apellido,
          datos.fecha_nacimiento,
          datos.genero,
        ]
      );
    } else if (id_tipo_cliente === 2) {
      await pool.query(
        "INSERT INTO CLIENTEJURIDICO (ID_CLIENTE, RAZONSOCIAL_CLIENTE, NOMBRECOMERCIAL_CLIENTE, REPRESENTANTE_CLIENTE, DIGITOVERIFICACION_CLIENTE) VALUES ($1, $2, $3, $4, $5)",
        [
          id_cliente,
          datos.razon_social,
          datos.nombre_comercial,
          datos.representante,
          datos.digito_verificacion,
        ]
      );
    }
    res.json({ message: "Cliente creado exitosamente", id_cliente });
  } catch (error) {
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const getClientesFormateados = async (req, res) => {
  try {
    const result = await pool.query(`
        SELECT 
          C.ID_CLIENTE, TC.DESCRIPCION_TIPOCLIENTE,
          CN.NOMBRE_CLIENTE, CN.APELLIDO_CLIENTE,
          CJ.RAZONSOCIAL_CLIENTE, CJ.REPRESENTANTE_CLIENTE
        FROM CLIENTE C
        JOIN TIPOCLIENTE TC ON C.ID_TIPOCLIENTE_CLIENTE = TC.ID_TIPOCLIENTE
        LEFT JOIN CLIENTENATURAL CN ON C.ID_CLIENTE = CN.ID_CLIENTE
        LEFT JOIN CLIENTEJURIDICO CJ ON C.ID_CLIENTE = CJ.ID_CLIENTE
      `);

    const clientes = result.rows; // PostgreSQL usa result.rows

    if (!Array.isArray(clientes)) {
      throw new Error("La consulta no devolvió un array.");
    }

    const clientesFormateados = clientes.map((cliente) => ({
      id: cliente.id_cliente,
      nombre:
        cliente.descripcion_tipocliente === "Persona Natural"
          ? `${cliente.nombre_cliente} ${cliente.apellido_cliente}`
          : cliente.representante_cliente,
      razon_social:
        cliente.descripcion_tipocliente === "Persona Jurídica"
          ? cliente.razonsocial_cliente
          : "No aplica",
      tipo: cliente.descripcion_tipocliente === "Persona Jurídica" ? "J" : "N",
    }));

    res.json(clientesFormateados);
  } catch (error) {
    console.error("Error al obtener clientes formateados:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
