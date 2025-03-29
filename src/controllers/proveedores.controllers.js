import { pool } from "../db.js";

// Obtener todos los proveedores
export const getProveedores = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR
      FROM PROVEEDOR p
      INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR
    `);
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener proveedores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener un proveedor por ID
export const getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      `SELECT p.*, tp.NOMBRE_TIPOPROVEEDOR
       FROM PROVEEDOR p
       INNER JOIN TIPOPROVEEDOR tp ON p.ID_TIPOPROVEEDOR_PROVEEDOR = tp.ID_TIPOPROVEEDOR
       WHERE p.ID_PROVEEDOR = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al obtener proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Obtener todos los tipos de proveedores
export const getTiposProveedores = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM TIPOPROVEEDOR WHERE ESTADO_TIPOPROVEEDOR = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener tipos de proveedores:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear tipo de proveedor
export const createTipoProveedor = async (req, res) => {
  try {
    const { nombre_tipoproveedor } = req.body;
    if (!nombre_tipoproveedor) {
      return res.status(400).json({ error: "El nombre del tipo es requerido" });
    }

    const [result] = await pool.query(
      "INSERT INTO TIPOPROVEEDOR (ID_TIPOPROVEEDOR, NOMBRE_TIPOPROVEEDOR, ESTADO_TIPOPROVEEDOR) VALUES (UUID(), ?, 'A')",
      [nombre_tipoproveedor]
    );

    res.status(201).json({ id: result.insertId, nombre_tipoproveedor });
  } catch (error) {
    console.error("Error al crear tipo de proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Crear un nuevo proveedor
export const createProveedor = async (req, res) => {
  try {
    console.log("Datos recibidos:", req.body); // Para depuración

    const {
      id_proveedor,
      nombre_proveedor,
      id_ciudad_proveedor,
      direccion_proveedor,
      telefono_proveedor,
      email_proveedor,
      id_tipoproveedor_proveedor, 
      representante_proveedor,
      fecharegistro_proveedor,
      saldo_proveedor,
      digitoverificacion_proveedor
    } = req.body;

    // Verifica si el proveedor ya está registrado
    const proveedorExistente = await pool.query(
      "SELECT * FROM PROVEEDOR WHERE id_proveedor = $1",
      [id_proveedor]
    );

    if (proveedorExistente.rows.length > 0) {
      return res.status(400).json({ message: "El proveedor ya está registrado" });
    }

    // Inserta el nuevo proveedor en la base de datos
    const nuevoProveedor = await pool.query(
      `INSERT INTO PROVEEDOR (
        id_proveedor, nombre_proveedor, id_ciudad_proveedor, direccion_proveedor, 
        telefono_proveedor, email_proveedor, id_tipoproveedor_proveedor, representante_proveedor, 
        fecharegistro_proveedor, saldo_proveedor, digitoverificacion_proveedor
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
      [
        id_proveedor,
        nombre_proveedor,
        id_ciudad_proveedor,
        direccion_proveedor,
        telefono_proveedor,
        email_proveedor,
        id_tipoproveedor_proveedor, 
        representante_proveedor,
        fecharegistro_proveedor,
        saldo_proveedor,
        digitoverificacion_proveedor
      ]
    );

    res.status(201).json({ message: "Proveedor registrado con éxito", data: nuevoProveedor.rows[0] });

  } catch (error) {
    console.error("Error al registrar proveedor:", error);
      error.message,
      error.detail, // Mensaje específico de PostgreSQL
      error.code, // Código de error SQL
      error.query // Query que falló
    res.status(500).json({ message: "Error al registrar proveedor", error: error.message });
  }
};

// Actualizar un proveedor
export const updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_proveedor,
      id_ciudad_proveedor,
      direccion_proveedor,
      telefono_proveedor,
      email_proveedor,
      id_tipoproveedor_proveedor,
      representante_proveedor,
      saldo_proveedor,
      estado_proveedor,
    } = req.body;

    // Se actualiza en la base de datos
    const result = await pool.query(
      `UPDATE PROVEEDOR 
       SET NOMBRE_PROVEEDOR = $1, ID_CIUDAD_PROVEEDOR = $2, DIRECCION_PROVEEDOR = $3, TELEFONO_PROVEEDOR = $4, 
           EMAIL_PROVEEDOR = $5, ID_TIPOPROVEEDOR_PROVEEDOR = $6, REPRESENTANTE_PROVEEDOR = $7, SALDO_PROVEEDOR = COALESCE($8, SALDO_PROVEEDOR), 
           ESTADO_PROVEEDOR = COALESCE($9, ESTADO_PROVEEDOR)
       WHERE ID_PROVEEDOR = $10 RETURNING *`,
      [
        nombre_proveedor,
        id_ciudad_proveedor,
        direccion_proveedor,
        telefono_proveedor,
        email_proveedor,
        id_tipoproveedor_proveedor,
        representante_proveedor,
        saldo_proveedor,
        estado_proveedor,
        id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Eliminar un proveedor 
export const deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "UPDATE PROVEEDOR SET ESTADO_PROVEEDOR = 'I' WHERE ID_PROVEEDOR = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Proveedor no encontrado" });
    }

    res.json({ message: "Proveedor eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar proveedor:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
