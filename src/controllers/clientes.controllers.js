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
export const crearCliente = async (req, res) => {
  const client = await pool.connect();
  try {
    const {
      id_cliente, // Cédula o NIT
      id_tipodocumento_cliente,
      id_tipocliente_cliente,
      telefono_cliente,
      id_sede_cliente,
      email_cliente,
      direccion_cliente,
      barrio_cliente,
      codigopostal_cliente,
      nombre_cliente,
      apellido_cliente,
      fechanacimiento_cliente,
      genero_cliente,
      razonsocial_cliente,
      nombrecomercial_cliente,
      representante_cliente,
      digitoverificacion_cliente,
    } = req.body;

    await client.query("BEGIN");

    // Verificar si ya existe un cliente con ese ID
    const existe = await client.query(
      "SELECT 1 FROM CLIENTE WHERE ID_CLIENTE = $1",
      [id_cliente]
    );

    if (existe.rows.length > 0) {
      throw new Error("Ya existe un cliente con ese documento o NIT.");
    }

    // Insertar en CLIENTE (tabla general)
    await client.query(
      `INSERT INTO CLIENTE (
        ID_CLIENTE,
        ID_TIPODOCUMENTO_CLIENTE,
        ID_TIPOCLIENTE_CLIENTE,
        TELEFONO_CLIENTE,
        ID_SEDE_CLIENTE,
        EMAIL_CLIENTE,
        DIRECCION_CLIENTE,
        BARRIO_CLIENTE,
        CODIGOPOSTAL_CLIENTE
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
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
      ]
    );

    // Cliente natural
    if (String(id_tipocliente_cliente) === "1") {
      await client.query(
        `INSERT INTO CLIENTENATURAL (
          ID_CLIENTE,
          NOMBRE_CLIENTE,
          APELLIDO_CLIENTE,
          FECHANACIMIENTO_CLIENTE,
          GENERO_CLIENTE
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          id_cliente,
          nombre_cliente,
          apellido_cliente,
          fechanacimiento_cliente,
          genero_cliente,
        ]
      );
    }

    // Cliente jurídico
    if (String(id_tipocliente_cliente) === "2") {
      await client.query(
        `INSERT INTO CLIENTEJURIDICO (
          ID_CLIENTE,
          RAZONSOCIAL_CLIENTE,
          NOMBRECOMERCIAL_CLIENTE,
          REPRESENTANTE_CLIENTE,
          DIGITOVERIFICACION_CLIENTE
        ) VALUES ($1, $2, $3, $4, $5)`,
        [
          id_cliente,
          razonsocial_cliente,
          nombrecomercial_cliente,
          representante_cliente,
          digitoverificacion_cliente,
        ]
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ message: "Cliente creado exitosamente" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear cliente:", error);
    res.status(500).json({ error: error.message || "Error al crear cliente" });
  } finally {
    client.release();
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

export const updateCliente = async (req, res) => {
  const { id } = req.params;
  const {
    telefono_cliente,
    id_sede_cliente,
    email_cliente,
    direccion_cliente,
    barrio_cliente,
    codigopostal_cliente,
    nombre_cliente,
    apellido_cliente,
    fechanacimiento_cliente,
    genero_cliente,
    razonsocial_cliente,
    nombrecomercial_cliente,
    representante_cliente,
    digitoverificacion_cliente,
    id_tipocliente_cliente, // Este sí lo necesitas para decidir cuál subtabla actualizar
  } = req.body;

  const client = await pool.connect();
  try {
    await client.query("BEGIN");

    await client.query(
      `
      UPDATE CLIENTE SET
        TELEFONO_CLIENTE = $1,
        ID_SEDE_CLIENTE = $2,
        EMAIL_CLIENTE = $3,
        DIRECCION_CLIENTE = $4,
        BARRIO_CLIENTE = $5,
        CODIGOPOSTAL_CLIENTE = $6
      WHERE ID_CLIENTE = $7
      `,
      [
        telefono_cliente,
        id_sede_cliente,
        email_cliente,
        direccion_cliente,
        barrio_cliente,
        codigopostal_cliente,
        id,
      ]
    );

    if (id_tipocliente_cliente === 1) {
      await client.query(
        `
        UPDATE CLIENTENATURAL SET
          NOMBRE_CLIENTE = $1,
          APELLIDO_CLIENTE = $2,
          FECHANACIMIENTO_CLIENTE = $3,
          GENERO_CLIENTE = $4
        WHERE ID_CLIENTE = $5
        `,
        [
          nombre_cliente,
          apellido_cliente,
          fechanacimiento_cliente,
          genero_cliente,
          id,
        ]
      );
    } else if (id_tipocliente_cliente === 2) {
      await client.query(
        `
        UPDATE CLIENTEJURIDICO SET
          RAZONSOCIAL_CLIENTE = $1,
          NOMBRECOMERCIAL_CLIENTE = $2,
          REPRESENTANTE_CLIENTE = $3,
          DIGITOVERIFICACION_CLIENTE = $4
        WHERE ID_CLIENTE = $5
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

    await client.query("COMMIT");
    res.status(200).json({ message: "Cliente actualizado correctamente" });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al actualizar cliente:", error);
    res.status(500).json({ message: "Error al actualizar cliente" });
  } finally {
    client.release();
  }
};

export const eliminarCliente = async (req, res) => {
  const { id } = req.params;

  try {
    // Cambiar estado en CLIENTE
    await pool.query(
      `UPDATE CLIENTE SET ESTADO_CLIENTE = 'I' WHERE ID_CLIENTE = $1`,
      [id]
    );

    // También puedes opcionalmente desactivar en CLIENTENATURAL o CLIENTEJURIDICO
    await pool.query(
      `UPDATE CLIENTENATURAL SET ESTADO_CLIENTE = 'I' WHERE ID_CLIENTE = $1`,
      [id]
    );
    await pool.query(
      `UPDATE CLIENTEJURIDICO SET ESTADO_CLIENTE = 'I' WHERE ID_CLIENTE = $1`,
      [id]
    );

    res
      .status(200)
      .json({ message: "Cliente eliminado correctamente (estado lógico)." });
  } catch (error) {
    console.error("Error al eliminar cliente:", error);
    res.status(500).json({ message: "Error al eliminar cliente." });
  }
};

// Obtener clientes por ID de sede
export const getClientesPorSede = async (req, res) => {
  const { idSede } = req.params;

  try {
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
      WHERE C.ID_SEDE_CLIENTE = $1 AND C.ESTADO_CLIENTE = 'A'
    `,
      [idSede]
    );

    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener clientes por sede:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
