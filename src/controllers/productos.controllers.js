import { pool } from "../db.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM producto WHERE ESTADO_PRODUCTO = 'A'"
    );
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Obtener un producto activo
export const getProducto = async (req, res) => {
  const { productoId } = req.params;
  try {
    const { rows } = await pool.query(
      "SELECT * FROM producto WHERE id_producto = $1 AND ESTADO_PRODUCTO = 'A'",
      [productoId]
    );

    if (rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Producto no encontrado o inactivo" });
    }

    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener el producto" });
  }
};

export const getProductosDetalles = async (req, res) => {
  try {
    const { rows } = await pool.query(`
        SELECT 
          p.*,
          c.DESCRIPCION_CATEGORIA AS categoria,
          COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_producto
        FROM PRODUCTO p
        JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
        LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
        WHERE p.ESTADO_PRODUCTO = 'A' 
        AND (i.ESTADO_INVENTARIO IS NULL OR i.ESTADO_INVENTARIO = 'A');
    `);

    res.json(rows);
  } catch (error) {
    console.error("Error al obtener detalles de productos:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los detalles de los productos" });
  }
};

// Crear un nuevo producto
export const createProducto = async (req, res) => {
  const {
    id_producto,
    id_categoria_producto,
    nombre_producto,
    descripcion_producto,
    precioventaact_producto,
    costoventa_producto,
    margenutilidad_producto,
    valoriva_producto,
  } = req.body;

  try {
    console.log("Datos recibidos:", req.body);

    const result = await pool.query(
      `INSERT INTO producto (id_producto, id_categoria_producto, nombre_producto, descripcion_producto, 
      precioventaact_producto, costoventa_producto, margenutilidad_producto, 
      valoriva_producto) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [
        id_producto,
        id_categoria_producto,
        nombre_producto,
        descripcion_producto,
        precioventaact_producto,
        costoventa_producto,
        margenutilidad_producto,
        valoriva_producto,
      ]
    );

    res.status(201).json(result.rows[0]); // Devolver el producto insertado
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al registrar el producto" });
  }
};

export const putProducto = async (req, res) => {
  const { productoId } = req.params;
  const nuevosDatos = req.body;

  try {
    // Verificar si el producto existe
    const { rows } = await pool.query(
      "SELECT * FROM producto WHERE id_producto = $1",
      [productoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const productoActual = rows[0];

    // Fusionar los datos actuales con los nuevos
    const datosActualizados = {
      id_categoria_producto:
        nuevosDatos.id_categoria_producto ??
        productoActual.id_categoria_producto,
      nombre_producto:
        nuevosDatos.nombre_producto ?? productoActual.nombre_producto,
      descripcion_producto:
        nuevosDatos.descripcion_producto ?? productoActual.descripcion_producto,
      precioventaact_producto:
        nuevosDatos.precioventaact_producto ??
        productoActual.precioventaact_producto,
      precioventaant_producto:
        nuevosDatos.precioventaant_producto ??
        productoActual.precioventaant_producto,
      costoventa_producto:
        nuevosDatos.costoventa_producto ?? productoActual.costoventa_producto,
      margenutilidad_producto:
        nuevosDatos.margenutilidad_producto ??
        productoActual.margenutilidad_producto,
      valoriva_producto:
        nuevosDatos.valoriva_producto ?? productoActual.valoriva_producto,
      estado_producto:
        nuevosDatos.estado_producto ?? productoActual.estado_producto,
    };

    // Ejecutar la actualización
    const result = await pool.query(
      `UPDATE producto 
         SET id_categoria_producto = $1, nombre_producto = $2, descripcion_producto = $3, 
             precioventaact_producto = $4, precioventaant_producto = $5, costoventa_producto = $6, 
             margenutilidad_producto = $7, valoriva_producto = $8, estado_producto = $9
         WHERE id_producto = $10
         RETURNING *`,
      [
        datosActualizados.id_categoria_producto,
        datosActualizados.nombre_producto,
        datosActualizados.descripcion_producto,
        datosActualizados.precioventaact_producto,
        datosActualizados.precioventaant_producto,
        datosActualizados.costoventa_producto,
        datosActualizados.margenutilidad_producto,
        datosActualizados.valoriva_producto,
        datosActualizados.estado_producto,
        productoId,
      ]
    );

    // Responder con el producto actualizado
    res.json({
      message: "Producto actualizado correctamente",
      producto: result.rows[0],
    });
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({
      message: "Error al actualizar el producto",
      error: error.message,
    });
  }
};

export const getProductoDetalle = async (req, res) => {
  console.log("Parámetros recibidos:", req.params); // <-- DEBUG

  const { productoId } = req.params;

  if (!productoId) {
    return res.status(400).json({ message: "Falta el ID del producto" });
  }

  try {
    const productoQuery = `
      SELECT 
        p.*, 
        c.DESCRIPCION_CATEGORIA AS categoria,
        COALESCE(i.EXISTENCIA_INVENTARIO, 0) AS existencia_total
      FROM PRODUCTO p
      JOIN CATEGORIA c ON p.ID_CATEGORIA_PRODUCTO = c.ID_CATEGORIA
      LEFT JOIN INVENTARIO i ON p.ID_PRODUCTO = i.ID_PRODUCTO_INVENTARIO
      WHERE p.ID_PRODUCTO = $1;
    `;

    const inventarioLocalQuery = `
      SELECT 
        il.ID_SEDE_INVENTARIOLOCAL AS sede_id,
        il.EXISTENCIA_INVENTARIOLOCAL AS existencia,
        il.STOCKMINIMO_INVENTARIOLOCAL AS stock_minimo,
        il.STOCKMAXIMO_INVENTARIOLOCAL AS stock_maximo,
        s.NOMBRE_SEDE AS sede_nombre
      FROM INVENTARIOLOCAL il
      JOIN SEDE s ON il.ID_SEDE_INVENTARIOLOCAL = s.ID_SEDE
      WHERE il.ID_PRODUCTO_INVENTARIOLOCAL = $1;
    `;

    console.log("Producto ID recibido:", productoId); // <-- DEBUG

    const { rows: productoRows } = await pool.query(productoQuery, [
      parseInt(productoId), // Asegurar que es un número entero
    ]);
    const { rows: inventarioRows } = await pool.query(inventarioLocalQuery, [
      parseInt(productoId),
    ]);

    if (productoRows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const producto = productoRows[0];
    producto.inventario_sedes = inventarioRows;

    res.json(producto);
  } catch (error) {
    console.error("Error al obtener detalles del producto:", error);
    res
      .status(500)
      .json({ message: "Error al obtener los detalles del producto" });
  }
};

// Eliminar un proveedor (cambio de estado a inactivo 'I')
export const deleteProducto = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("ID recibido para eliminar:", id); // <-- Depuración

    const result = await pool.query(
      "UPDATE PRODUCTO SET ESTADO_PRODUCTO = 'I' WHERE ID_PRODUCTO = $1 RETURNING *",
      [id]
    );

    console.log("Resultado de la actualización:", result.rows); // <-- Depuración

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json({ message: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
