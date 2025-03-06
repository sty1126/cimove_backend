import { pool } from "../db.js";

// Obtener todos los productos
export const getProductos = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM producto");
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al obtener los productos" });
  }
};

// Obtener un producto
export const getProducto = async (req, res) => {
  const { productoId } = req.params;
  const { rows } = await pool.query(
    "SELECT * FROM producto WHERE id_producto = $1",
    [productoId]
  );
  console.log(rows);
  res.json(rows);

  if (rows.length === 0) {
    return res.status(404).json({ message: "Usuario no encontrado" });
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
    // Obtener el producto actual
    const { rows } = await pool.query(
      "SELECT * FROM producto WHERE id_producto = $1",
      [productoId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Producto actual en la base de datos
    const productoActual = rows[0];

    // Fusionar los datos actuales con los nuevos, priorizando los nuevos
    const datosActualizados = {
      id_categoria_producto:
        nuevosDatos.id_categoria_producto ||
        productoActual.id_categoria_producto,
      nombre_producto:
        nuevosDatos.nombre_producto || productoActual.nombre_producto,
      descripcion_producto:
        nuevosDatos.descripcion_producto || productoActual.descripcion_producto,
      precioventaact_producto:
        nuevosDatos.precioventaact_producto ||
        productoActual.precioventaact_producto,
      precioventaant_producto:
        nuevosDatos.precioventaant_producto ||
        productoActual.precioventaant_producto,
      costoventa_producto:
        nuevosDatos.costoventa_producto || productoActual.costoventa_producto,
      margenutilidad_producto:
        nuevosDatos.margenutilidad_producto ||
        productoActual.margenutilidad_producto,
      valoriva_producto:
        nuevosDatos.valoriva_producto || productoActual.valoriva_producto,
      estado_producto:
        nuevosDatos.estado_producto || productoActual.estado_producto, // Nuevo campo
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

    res.json(result.rows[0]); // Devolver el producto actualizado
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al actualizar el producto" });
  }
};
