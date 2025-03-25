import { pool } from "../db.js";

// Obtener todo el inventario local
export const getInventarioLocal = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM inventariolocal");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el inventario local" });
  }
};

// Obtener inventario local por sede
export const getInventarioLocalBySede = async (req, res) => {
  const { sedeId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT i.*, COALESCE(i.existencia_inventariolocal, 0) AS existencia_producto, p.* FROM INVENTARIOLOCAL i JOIN PRODUCTO p ON i.id_producto_inventariolocal = p.id_producto WHERE i.id_sede_inventariolocal = $1;",
      [sedeId]
    );
    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "No hay inventario en esta sede" });
    }
    res.json(rows);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al obtener el inventario local por sede" });
  }
};

// Crear un nuevo registro de inventario local
export const createInventarioLocal = async (req, res) => {
  const {
    id_producto_inventariolocal,
    id_sede_inventariolocal,
    existencia_inventariolocal,
    stockminimo_inventariolocal,
    stockmaximo_inventariolocal,
    estado_inventariolocal,
  } = req.body;

  // Validaciones básicas
  if (
    !id_producto_inventariolocal ||
    !id_sede_inventariolocal ||
    existencia_inventariolocal === undefined ||
    stockmaximo_inventariolocal === undefined
  ) {
    return res.status(400).json({
      message: "Todos los campos obligatorios deben estar presentes.",
    });
  }

  if (
    existencia_inventariolocal < 0 ||
    stockminimo_inventariolocal < 0 ||
    stockmaximo_inventariolocal < 1
  ) {
    return res
      .status(400)
      .json({ message: "Los valores de stock deben ser positivos." });
  }

  try {
    // Verificar si el producto ya está registrado en esa sede
    const existing = await pool.query(
      "SELECT * FROM inventariolocal WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2",
      [id_producto_inventariolocal, id_sede_inventariolocal]
    );

    if (existing.rows.length > 0) {
      return res
        .status(409)
        .json({ message: "El producto ya está registrado en esta sede." });
    }

    // Insertar en la base de datos
    const result = await pool.query(
      `INSERT INTO inventariolocal (id_producto_inventariolocal, id_sede_inventariolocal, existencia_inventariolocal, 
        stockminimo_inventariolocal, stockmaximo_inventariolocal, estado_inventariolocal)
      VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        id_producto_inventariolocal,
        id_sede_inventariolocal,
        existencia_inventariolocal,
        stockminimo_inventariolocal || null, // Si no se envía, será NULL en la BD
        stockmaximo_inventariolocal,
        estado_inventariolocal || "A",
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    // Manejo de errores específicos
    if (error.code === "23503") {
      return res
        .status(400)
        .json({ message: "El producto o la sede no existen." });
    }

    if (error.code === "22P02") {
      return res.status(400).json({ message: "Formato de datos inválido." });
    }

    res
      .status(500)
      .json({ message: "Error al registrar el inventario local." });
  }
};

export const updateInventarioLocal = async (req, res) => {
  const { inventarioLocalId } = req.params;
  const nuevosDatos = req.body;

  try {
    const { rows } = await pool.query(
      "SELECT * FROM inventariolocal WHERE id_inventariolocal = $1",
      [inventarioLocalId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Inventario local no encontrado" });
    }

    const inventarioLocalActual = rows[0];

    const datosActualizados = {
      id_producto_inventariolocal:
        nuevosDatos.id_producto_inventariolocal ??
        inventarioLocalActual.id_producto_inventariolocal,
      id_sede_inventariolocal:
        nuevosDatos.id_sede_inventariolocal ??
        inventarioLocalActual.id_sede_inventariolocal,
      existencia_inventariolocal:
        nuevosDatos.existencia_inventariolocal ??
        inventarioLocalActual.existencia_inventariolocal,
      stockminimo_inventariolocal:
        nuevosDatos.stockminimo_inventariolocal ??
        inventarioLocalActual.stockminimo_inventariolocal,
      stockmaximo_inventariolocal:
        nuevosDatos.stockmaximo_inventariolocal ??
        inventarioLocalActual.stockmaximo_inventariolocal,
      estado_inventariolocal:
        nuevosDatos.estado_inventariolocal ??
        inventarioLocalActual.estado_inventariolocal,
    };

    const result = await pool.query(
      `UPDATE inventariolocal 
      SET id_producto_inventariolocal = $1, id_sede_inventariolocal = $2, existencia_inventariolocal = $3, 
      stockminimo_inventariolocal = $4, stockmaximo_inventariolocal = $5, estado_inventariolocal = $6
      WHERE id_inventariolocal = $7 RETURNING *`,
      [
        datosActualizados.id_producto_inventariolocal,
        datosActualizados.id_sede_inventariolocal,
        datosActualizados.existencia_inventariolocal,
        datosActualizados.stockminimo_inventariolocal,
        datosActualizados.stockmaximo_inventariolocal,
        datosActualizados.estado_inventariolocal,
        inventarioLocalId,
      ]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar el inventario local" });
  }
};

export const addStockToSede = async (req, res) => {
  const { idProducto, idSede } = req.params;
  const { cantidad } = req.body;

  if (!cantidad || cantidad <= 0) {
    return res.status(400).json({ message: "La cantidad debe ser mayor a 0" });
  }

  try {
    await pool.query("BEGIN");

    // Verificar si el producto existe en la sede
    const { rows } = await pool.query(
      "SELECT existencia_inventariolocal FROM INVENTARIOLOCAL WHERE id_producto_inventariolocal = $1 AND id_sede_inventariolocal = $2",
      [idProducto, idSede]
    );

    if (rows.length === 0) {
      await pool.query("ROLLBACK");
      return res
        .status(404)
        .json({ message: "El producto no está en esta sede" });
    }

    // Actualizar inventario local
    await pool.query(
      "UPDATE INVENTARIOLOCAL SET existencia_inventariolocal = existencia_inventariolocal + $1 WHERE id_producto_inventariolocal = $2 AND id_sede_inventariolocal = $3",
      [cantidad, idProducto, idSede]
    );

    // Actualizar inventario general
    await pool.query(
      "UPDATE INVENTARIO SET existencia_inventario = existencia_inventario + $1 WHERE id_producto_inventario = $2",
      [cantidad, idProducto]
    );

    await pool.query("COMMIT");
    res.json({ message: "Stock añadido exitosamente" });
  } catch (err) {
    await pool.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ error: "Error al actualizar stock" });
  }
};

export const existeEnInventarioLocal = async (req, res) => {
  const { idProducto, idSede } = req.params;

  try {
    const result = await pool.query(
      "SELECT ID_INVENTARIOLOCAL FROM INVENTARIOLOCAL WHERE ID_PRODUCTO_INVENTARIOLOCAL = $1 AND ID_SEDE_INVENTARIOLOCAL = $2",
      [idProducto, idSede]
    );

    if (result.rows.length > 0) {
      res.json({
        existe: true,
        inventarioLocalId: result.rows[0].id_inventariolocal,
      });
    } else {
      res.json({ existe: false });
    }
  } catch (error) {
    console.error("Error en existeEnInventarioLocal:", error);
    res.status(500).json({ error: "Error de servidor" }); // Asegurar JSON
  }
};
